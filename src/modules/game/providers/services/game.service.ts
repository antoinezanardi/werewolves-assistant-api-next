import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import type { Types } from "mongoose";
import { API_RESOURCES } from "../../../../shared/api/enums/api.enum";
import { BAD_RESOURCE_MUTATION_REASONS } from "../../../../shared/error/enums/bad-resource-mutation-error.enum";
import { BadResourceMutationError } from "../../../../shared/error/types/bad-resource-mutation-error.type";
import { ResourceNotFoundError } from "../../../../shared/error/types/resource-not-found-error.type";
import { CreateGameDto } from "../../dto/create-game/create-game.dto";
import type { MakeGamePlayDto } from "../../dto/make-game-play/make-game-play.dto";
import { GAME_STATUSES } from "../../enums/game.enum";
import { createMakeGamePlayDtoWithRelations } from "../../helpers/game-play.helper";
import { generateGameVictoryData, isGameOver } from "../../helpers/game-victory/game-victory.helper";
import type { Game } from "../../schemas/game.schema";
import { GameRepository } from "../repositories/game.repository";
import { GamePlaysManagerService } from "./game-play/game-plays-manager.service";
import { GamePlaysValidatorService } from "./game-play/game-plays-validator.service";

@Injectable()
export class GameService {
  public constructor(
    private readonly gamePlaysManagerService: GamePlaysManagerService,
    private readonly gamePlaysValidatorService: GamePlaysValidatorService,
    private readonly gameRepository: GameRepository,
  ) {}

  public async getGames(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  public async getGameById(id: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ _id: id });
    if (game === null) {
      throw new ResourceNotFoundError(API_RESOURCES.GAMES, id);
    }
    return game;
  }

  public async createGame(game: CreateGameDto): Promise<Game> {
    const gameToCreate = plainToInstance(CreateGameDto, {
      ...game,
      upcomingPlays: this.gamePlaysManagerService.getUpcomingNightPlays(game),
    });
    return this.gameRepository.create(gameToCreate);
  }

  public async getGameAndCheckPlayingStatus(gameId: Types.ObjectId): Promise<Game> {
    const game = await this.gameRepository.findOne({ _id: gameId });
    if (game === null) {
      throw new ResourceNotFoundError(API_RESOURCES.GAMES, gameId.toString());
    } else if (game.status !== GAME_STATUSES.PLAYING) {
      throw new BadResourceMutationError(API_RESOURCES.GAMES, game._id.toString(), BAD_RESOURCE_MUTATION_REASONS.GAME_NOT_PLAYING);
    }
    return game;
  }

  public async cancelGameById(gameId: Types.ObjectId): Promise<Game> {
    await this.getGameAndCheckPlayingStatus(gameId);
    const updatedGame = await this.gameRepository.updateOne({ _id: gameId }, { status: GAME_STATUSES.CANCELED });
    if (updatedGame === null) {
      throw new ResourceNotFoundError(API_RESOURCES.GAMES, gameId.toString());
    }
    return updatedGame;
  }

  public async makeGamePlay(gameId: Types.ObjectId, makeGamePlayDto: MakeGamePlayDto): Promise<Game> {
    const game = await this.getGameAndCheckPlayingStatus(gameId);
    const gameDataToUpdate: Partial<Game> = {};
    const makeGamePlayWithRelationsDto = createMakeGamePlayDtoWithRelations(makeGamePlayDto, game);
    await this.gamePlaysValidatorService.validateGamePlayWithRelationsDtoData(makeGamePlayWithRelationsDto, game);
    if (isGameOver(game)) {
      gameDataToUpdate.status = GAME_STATUSES.OVER;
      gameDataToUpdate.victory = generateGameVictoryData(game);
    }
    const updatedGame = await this.gameRepository.updateOne({ _id: gameId }, gameDataToUpdate);
    if (updatedGame === null) {
      throw new ResourceNotFoundError(API_RESOURCES.GAMES, gameId.toString());
    }
    return updatedGame;
  }
}