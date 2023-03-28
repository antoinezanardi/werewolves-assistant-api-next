import { Injectable } from "@nestjs/common";
import { API_RESOURCES } from "../../../../shared/api/enums/api.enum";
import { BAD_RESOURCE_MUTATION_REASONS } from "../../../../shared/error/enums/bad-resource-mutation-error.enum";
import { BadResourceMutationError } from "../../../../shared/error/types/bad-resource-mutation-error.type";
import { ResourceNotFoundError } from "../../../../shared/error/types/resource-not-found-error.type";
import type { CreateGameDto } from "../../dto/create-game/create-game.dto";
import { GAME_STATUSES } from "../../enums/game.enum";
import type { Game } from "../../schemas/game.schema";
import { GameRepository } from "../repositories/game.repository";
import { GamePlaysManagerService } from "./game-plays-manager.service";

@Injectable()
export class GameService {
  public constructor(
    private readonly gamePlaysManagerService: GamePlaysManagerService,
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
    game.upcomingPlays = this.gamePlaysManagerService.getUpcomingNightPlays(game);
    return this.gameRepository.create(game);
  }

  public async cancelGameById(id: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ _id: id });
    if (game === null) {
      throw new ResourceNotFoundError(API_RESOURCES.GAMES, id);
    } else if (game.status !== GAME_STATUSES.PLAYING) {
      throw new BadResourceMutationError(API_RESOURCES.GAMES, game._id, BAD_RESOURCE_MUTATION_REASONS.GAME_NOT_PLAYING);
    }
    const updatedGame = await this.gameRepository.updateOne({ _id: id }, { status: GAME_STATUSES.CANCELED });
    if (updatedGame === null) {
      throw new ResourceNotFoundError(API_RESOURCES.GAMES, id);
    }
    return updatedGame;
  }
}