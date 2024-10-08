import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import type { Types } from "mongoose";

import { CreateGameFeedbackDto } from "@/modules/game/dto/create-game-feedback/create-game-feedback.dto";
import { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import type { MakeGamePlayDto } from "@/modules/game/dto/make-game-play/make-game-play.dto";
import { isGamePhaseOver } from "@/modules/game/helpers/game-phase/game-phase.helpers";
import { createMakeGamePlayDtoWithRelations } from "@/modules/game/helpers/game-play/game-play.helpers";
import { createGame as createGameFromFactory } from "@/modules/game/helpers/game.factory";
import { getDistinctPlayerGroups } from "@/modules/game/helpers/game.helpers";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameEventsGeneratorService } from "@/modules/game/providers/services/game-event/game-events-generator.service";
import { GameFeedbackService } from "@/modules/game/providers/services/game-feedback/game-feedback.service";
import { GameHistoryRecordToInsertGeneratorService } from "@/modules/game/providers/services/game-history/game-history-record-to-insert-generator.service";
import { GameHistoryRecordService } from "@/modules/game/providers/services/game-history/game-history-record.service";
import { GamePhaseService } from "@/modules/game/providers/services/game-phase/game-phase.service";
import { GamePlayMakerService } from "@/modules/game/providers/services/game-play/game-play-maker/game-play-maker.service";
import { GamePlayValidatorService } from "@/modules/game/providers/services/game-play/game-play-validator.service";
import { GamePlayService } from "@/modules/game/providers/services/game-play/game-play.service";
import { GameVictoryService } from "@/modules/game/providers/services/game-victory/game-victory.service";
import { PlayerAttributeService } from "@/modules/game/providers/services/player/player-attribute.service";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play.types";

import { ApiResources } from "@/shared/api/enums/api.enums";
import { BadResourceMutationReasons } from "@/shared/exception/enums/bad-resource-mutation-error.enums";
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
    private readonly gameEventsGeneratorService: GameEventsGeneratorService,
    private readonly gameHistoryRecordService: GameHistoryRecordService,
    private readonly gameHistoryRecordToInsertGeneratorService: GameHistoryRecordToInsertGeneratorService,
    private readonly gameFeedbackService: GameFeedbackService,
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
    const distinctPlayerGroups = getDistinctPlayerGroups(game);
    const gameToCreate = plainToInstance(CreateGameDto, {
      ...game,
      currentPlay,
      upcomingPlays,
      playerGroups: distinctPlayerGroups.length ? distinctPlayerGroups : undefined,
    });
    let createdGame = await this.gameRepository.create(gameToCreate) as GameWithCurrentPlay;
    createdGame = await this.gamePlayService.augmentCurrentGamePlay(createdGame);
    if (this.gamePhaseService.isTwilightPhaseOver(createdGame)) {
      createdGame.phase.name = "night";
    }
    createdGame.events = this.gameEventsGeneratorService.generateGameEventsFromGameAndLastRecord(createdGame);

    return this.updateGame(createdGame._id, createdGame);
  }

  public async cancelGame(game: Game): Promise<Game> {
    this.validateGameIsPlaying(game);

    return this.updateGame(game._id, { status: "canceled" });
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
    clonedGame.phase.tick++;
    if (game.phase.name === "twilight" && this.gamePhaseService.isTwilightPhaseOver(clonedGame)) {
      clonedGame = this.handleTwilightPhaseCompletion(clonedGame);
    }
    if (isGamePhaseOver(clonedGame)) {
      clonedGame = await this.handleGamePhaseCompletion(clonedGame);
    }
    const gameHistoryRecordToInsert = this.gameHistoryRecordToInsertGeneratorService.generateCurrentGameHistoryRecordToInsert(game, clonedGame, play);
    const gameHistoryRecord = await this.gameHistoryRecordService.createGameHistoryRecord(gameHistoryRecordToInsert);
    if (this.gameVictoryService.isGameOver(clonedGame)) {
      return this.updateGameAsOver(clonedGame);
    }
    clonedGame = await this.gamePlayService.augmentCurrentGamePlay(clonedGame as GameWithCurrentPlay);
    clonedGame.events = this.gameEventsGeneratorService.generateGameEventsFromGameAndLastRecord(clonedGame, gameHistoryRecord);

    return this.updateGame(clonedGame._id, clonedGame);
  }

  public async createGameFeedback(game: Game, createGameFeedbackDto: CreateGameFeedbackDto): Promise<Game> {
    const clonedGame = createGameFromFactory(game);
    clonedGame.feedback = await this.gameFeedbackService.createGameFeedback(clonedGame, createGameFeedbackDto);

    return clonedGame;
  }

  private validateGameIsPlaying(game: Game): void {
    if (game.status !== "playing") {
      throw new BadResourceMutationException(ApiResources.GAMES, game._id.toString(), BadResourceMutationReasons.GAME_NOT_PLAYING);
    }
  }

  private handleTwilightPhaseCompletion(game: Game): Game {
    const clonedGame = createGameFromFactory(game);
    clonedGame.phase.name = "night";
    clonedGame.phase.tick = 1;

    return clonedGame;
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
    clonedGame.status = "over";
    clonedGame.victory = this.gameVictoryService.generateGameVictoryData(clonedGame);

    return clonedGame;
  }

  private async updateGameAsOver(game: Game): Promise<Game> {
    const clonedGame = this.setGameAsOver(game);

    return this.updateGame(clonedGame._id, clonedGame);
  }
}