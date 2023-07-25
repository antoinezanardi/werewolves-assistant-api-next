import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { cloneDeep } from "lodash";
import type { Types } from "mongoose";
import { API_RESOURCES } from "../../../../shared/api/enums/api.enum";
import { BAD_RESOURCE_MUTATION_REASONS } from "../../../../shared/exception/enums/bad-resource-mutation-error.enum";
import { createCantGenerateGamePlaysUnexpectedException } from "../../../../shared/exception/helpers/unexpected-exception.factory";
import { BadResourceMutationException } from "../../../../shared/exception/types/bad-resource-mutation-exception.type";
import { ResourceNotFoundException } from "../../../../shared/exception/types/resource-not-found-exception.type";
import { CreateGameDto } from "../../dto/create-game/create-game.dto";
import type { MakeGamePlayDto } from "../../dto/make-game-play/make-game-play.dto";
import { GAME_STATUSES } from "../../enums/game.enum";
import { isGamePhaseOver } from "../../helpers/game-phase/game-phase.helper";
import { createMakeGamePlayDtoWithRelations } from "../../helpers/game-play/game-play.helper";
import { generateGameVictoryData, isGameOver } from "../../helpers/game-victory/game-victory.helper";
import type { Game } from "../../schemas/game.schema";
import { GameRepository } from "../repositories/game.repository";
import { GamePhaseService } from "./game-phase/game-phase.service";
import { GamePlayMakerService } from "./game-play/game-play-maker.service";
import { GamePlayValidatorService } from "./game-play/game-play-validator.service";
import { GamePlayService } from "./game-play/game-play.service";
import { PlayerAttributeService } from "./player/player-attribute.service";

@Injectable()
export class GameService {
  public constructor(
    private readonly gamePlayService: GamePlayService,
    private readonly gamePlayValidatorService: GamePlayValidatorService,
    private readonly gamePlayMakerService: GamePlayMakerService,
    private readonly gamePhaseService: GamePhaseService,
    private readonly gameRepository: GameRepository,
    private readonly playerAttributeService: PlayerAttributeService,
  ) {}

  public async getGames(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  public async createGame(game: CreateGameDto): Promise<Game> {
    const upcomingPlays = this.gamePlayService.getUpcomingNightPlays(game);
    if (!upcomingPlays.length) {
      throw createCantGenerateGamePlaysUnexpectedException("createGame");
    }
    const currentPlay = upcomingPlays.shift();
    const gameToCreate = plainToInstance(CreateGameDto, {
      ...game,
      upcomingPlays,
      currentPlay,
    });
    return this.gameRepository.create(gameToCreate);
  }

  public async cancelGame(game: Game): Promise<Game> {
    if (game.status !== GAME_STATUSES.PLAYING) {
      throw new BadResourceMutationException(API_RESOURCES.GAMES, game._id.toString(), BAD_RESOURCE_MUTATION_REASONS.GAME_NOT_PLAYING);
    }
    return this.updateGame(game._id, { status: GAME_STATUSES.CANCELED });
  }

  public async makeGamePlay(game: Game, makeGamePlayDto: MakeGamePlayDto): Promise<Game> {
    let clonedGame = cloneDeep(game);
    if (clonedGame.status !== GAME_STATUSES.PLAYING) {
      throw new BadResourceMutationException(API_RESOURCES.GAMES, clonedGame._id.toString(), BAD_RESOURCE_MUTATION_REASONS.GAME_NOT_PLAYING);
    }
    const play = createMakeGamePlayDtoWithRelations(makeGamePlayDto, clonedGame);
    await this.gamePlayValidatorService.validateGamePlayWithRelationsDto(play, clonedGame);
    clonedGame = await this.gamePlayMakerService.makeGamePlay(play, clonedGame);
    clonedGame = this.gamePlayService.removeObsoleteUpcomingPlays(clonedGame);
    clonedGame = this.gamePlayService.proceedToNextGamePlay(clonedGame);
    if (isGamePhaseOver(clonedGame)) {
      clonedGame = this.gamePhaseService.applyEndingGamePhasePlayerAttributesOutcomesToPlayers(clonedGame);
      clonedGame = this.playerAttributeService.decreaseRemainingPhasesAndRemoveObsoletePlayerAttributes(clonedGame);
      clonedGame = this.gamePhaseService.switchPhaseAndGenerateGamePhasePlays(clonedGame);
    }
    if (isGameOver(clonedGame)) {
      clonedGame = this.setGameAsOver(clonedGame);
    }
    clonedGame.tick++;
    return this.updateGame(clonedGame._id, clonedGame);
  }

  private async updateGame(gameId: Types.ObjectId, gameDataToUpdate: Partial<Game>): Promise<Game> {
    const updatedGame = await this.gameRepository.updateOne({ _id: gameId }, gameDataToUpdate);
    if (updatedGame === null) {
      throw new ResourceNotFoundException(API_RESOURCES.GAMES, gameId.toString());
    }
    return updatedGame;
  }

  private setGameAsOver(game: Game): Game {
    const clonedGame = cloneDeep(game);
    clonedGame.status = GAME_STATUSES.OVER;
    clonedGame.victory = generateGameVictoryData(clonedGame);
    return clonedGame;
  }
}