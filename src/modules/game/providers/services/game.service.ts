import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import type { Types } from "mongoose";

import { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import type { MakeGamePlayDto } from "@/modules/game/dto/make-game-play/make-game-play.dto";
import { GameStatuses } from "@/modules/game/enums/game.enum";
import { isGamePhaseOver } from "@/modules/game/helpers/game-phase/game-phase.helpers";
import { createMakeGamePlayDtoWithRelations } from "@/modules/game/helpers/game-play/game-play.helpers";
import { GameVictoryService } from "@/modules/game/providers/services/game-victory/game-victory.service";
import { createGame as createGameFromFactory } from "@/modules/game/helpers/game.factory";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePhaseService } from "@/modules/game/providers/services/game-phase/game-phase.service";
import { GamePlayMakerService } from "@/modules/game/providers/services/game-play/game-play-maker/game-play-maker.service";
import { GamePlayValidatorService } from "@/modules/game/providers/services/game-play/game-play-validator.service";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play.types";

import { ApiResources } from "@/shared/api/enums/api.enum";
import { BadResourceMutationReasons } from "@/shared/exception/enums/bad-resource-mutation-error.enum";
import { createCantGenerateGamePlaysUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";
import { BadResourceMutationException } from "@/shared/exception/types/bad-resource-mutation-exception.types";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.types";

@Injectable()
export class GameService {
  public constructor(
    private readonly gamePlayService: GamePlayService,
    private readonly gamePlayValidatorService: GamePlayValidatorService,
    private readonly gamePlayMakerService: GamePlayMakerService,
    private readonly gamePhaseService: GamePhaseService,
    private readonly gameVictoryService: GameVictoryService,
    private readonly gameRepository: GameRepository,
    private readonly playerAttributeService: PlayerAttributeService,
    private readonly gameHistoryRecordService: GameHistoryRecordService,
  ) {}

  public async getGames(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  public async createGame(game: CreateGameDto): Promise<Game> {
    const upcomingPlays = await this.gamePlayService.getPhaseUpcomingPlays(game);
    if (!upcomingPlays.length) {
      throw createCantGenerateGamePlaysUnexpectedException("createGame");
    }
    const currentPlay = upcomingPlays[0];
    upcomingPlays.shift();
    const gameToCreate = plainToInstance(CreateGameDto, {
      ...game,
      currentPlay,
      upcomingPlays,
    });
    let createdGame = await this.gameRepository.create(gameToCreate) as GameWithCurrentPlay;
    createdGame = await this.gamePlayService.augmentCurrentGamePlay(createdGame);
    return this.updateGame(createdGame._id, createdGame);
  }

  public async cancelGame(game: Game): Promise<Game> {
    this.validateGameIsPlaying(game);
    return this.updateGame(game._id, { status: GameStatuses.CANCELED });
  }

  public async makeGamePlay(game: Game, makeGamePlayDto: MakeGamePlayDto): Promise<Game> {
    let clonedGame = createGameFromFactory(game);
    this.validateGameIsPlaying(clonedGame);
    const play = createMakeGamePlayDtoWithRelations(makeGamePlayDto, clonedGame);
    await this.gamePlayValidatorService.validateGamePlayWithRelationsDto(play, clonedGame);
    clonedGame = await this.gamePlayMakerService.makeGamePlay(play, clonedGame);
    clonedGame = await this.gamePlayService.refreshUpcomingPlays(clonedGame);
    clonedGame = this.gamePlayService.proceedToNextGamePlay(clonedGame);
    clonedGame.tick++;
    if (isGamePhaseOver(clonedGame)) {
      clonedGame = await this.handleGamePhaseCompletion(clonedGame);
    }
    const gameHistoryRecordToInsert = this.gameHistoryRecordService.generateCurrentGameHistoryRecordToInsert(game, clonedGame, play);
    await this.gameHistoryRecordService.createGameHistoryRecord(gameHistoryRecordToInsert);
    if (this.gameVictoryService.isGameOver(clonedGame)) {
      return this.updateGameAsOver(clonedGame);
    }
    clonedGame = await this.gamePlayService.augmentCurrentGamePlay(clonedGame as GameWithCurrentPlay);
    return this.updateGame(clonedGame._id, clonedGame);
  }

  private validateGameIsPlaying(game: Game): void {
    if (game.status !== GameStatuses.PLAYING) {
      throw new BadResourceMutationException(ApiResources.GAMES, game._id.toString(), BadResourceMutationReasons.GAME_NOT_PLAYING);
    }
  }

  private async handleGamePhaseCompletion(game: Game): Promise<Game> {
    let clonedGame = createGameFromFactory(game);
    clonedGame = await this.gamePhaseService.applyEndingGamePhaseOutcomes(clonedGame);
    clonedGame = this.playerAttributeService.decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes(clonedGame);
    clonedGame = await this.gamePhaseService.switchPhaseAndAppendGamePhaseUpcomingPlays(clonedGame);
    clonedGame = this.gamePhaseService.applyStartingGamePhaseOutcomes(clonedGame);
    clonedGame = await this.gamePlayService.refreshUpcomingPlays(clonedGame);
    clonedGame = this.gamePlayService.proceedToNextGamePlay(clonedGame);
    if (isGamePhaseOver(clonedGame)) {
      clonedGame = await this.handleGamePhaseCompletion(clonedGame);
      clonedGame = await this.gamePlayService.refreshUpcomingPlays(clonedGame);
    }
    return clonedGame;
  }

  private async updateGame(gameId: Types.ObjectId, gameDataToUpdate: Partial<Game>): Promise<Game> {
    const updatedGame = await this.gameRepository.updateOne({ _id: gameId }, gameDataToUpdate);
    if (updatedGame === null) {
      throw new ResourceNotFoundException(ApiResources.GAMES, gameId.toString());
    }
    return updatedGame;
  }

  private setGameAsOver(game: Game): Game {
    const clonedGame = createGameFromFactory(game);
    clonedGame.status = GameStatuses.OVER;
    clonedGame.victory = this.gameVictoryService.generateGameVictoryData(clonedGame);
    return clonedGame;
  }

  private async updateGameAsOver(game: Game): Promise<Game> {
    const clonedGame = this.setGameAsOver(game);
    return this.updateGame(clonedGame._id, clonedGame);
  }
}