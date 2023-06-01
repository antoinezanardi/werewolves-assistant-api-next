import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { API_RESOURCES } from "../../../../shared/api/enums/api.enum";
import { BAD_RESOURCE_MUTATION_REASONS } from "../../../../shared/exception/enums/bad-resource-mutation-error.enum";
import { BadResourceMutationException } from "../../../../shared/exception/types/bad-resource-mutation-exception.type";
import { ResourceNotFoundException } from "../../../../shared/exception/types/resource-not-found-exception.type";
import { CreateGameDto } from "../../dto/create-game/create-game.dto";
import type { MakeGamePlayDto } from "../../dto/make-game-play/make-game-play.dto";
import { GAME_STATUSES } from "../../enums/game.enum";
import { createMakeGamePlayDtoWithRelations } from "../../helpers/game-play/game-play.helper";
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
      throw new ResourceNotFoundException(API_RESOURCES.GAMES, id);
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

  public async cancelGame(game: Game): Promise<Game> {
    if (game.status !== GAME_STATUSES.PLAYING) {
      throw new BadResourceMutationException(API_RESOURCES.GAMES, game._id.toString(), BAD_RESOURCE_MUTATION_REASONS.GAME_NOT_PLAYING);
    }
    const updatedGame = await this.gameRepository.updateOne({ _id: game._id }, { status: GAME_STATUSES.CANCELED });
    if (updatedGame === null) {
      throw new ResourceNotFoundException(API_RESOURCES.GAMES, game._id.toString());
    }
    return updatedGame;
  }

  public async makeGamePlay(game: Game, makeGamePlayDto: MakeGamePlayDto): Promise<Game> {
    if (game.status !== GAME_STATUSES.PLAYING) {
      throw new BadResourceMutationException(API_RESOURCES.GAMES, game._id.toString(), BAD_RESOURCE_MUTATION_REASONS.GAME_NOT_PLAYING);
    }
    const gameDataToUpdate: Partial<Game> = {};
    const makeGamePlayWithRelationsDto = createMakeGamePlayDtoWithRelations(makeGamePlayDto, game);
    await this.gamePlaysValidatorService.validateGamePlayWithRelationsDtoData(makeGamePlayWithRelationsDto, game);
    if (isGameOver(game)) {
      gameDataToUpdate.status = GAME_STATUSES.OVER;
      gameDataToUpdate.victory = generateGameVictoryData(game);
    }
    const updatedGame = await this.gameRepository.updateOne({ _id: game._id }, gameDataToUpdate);
    if (updatedGame === null) {
      throw new ResourceNotFoundException(API_RESOURCES.GAMES, game._id.toString());
    }
    return updatedGame;
  }
}