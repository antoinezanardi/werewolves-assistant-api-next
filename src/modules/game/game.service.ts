import { Injectable } from "@nestjs/common";
import { API_RESOURCES } from "../../shared/api/enums/api.enum";
import { ResourceNotFoundError } from "../../shared/error/types/error.type";
import type { CreateGameDto } from "./dto/create-game/create-game.dto";
import { GameRepository } from "./game.repository";
import type { Game } from "./schemas/game.schema";

@Injectable()
export class GameService {
  public constructor(private readonly gameRepository: GameRepository) {}
  public async getGames(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  public async getGameById(id: string): Promise<Game> {
    const game = await this.gameRepository.findOne({ id });
    if (game === null) {
      throw new ResourceNotFoundError(API_RESOURCES.GAMES, id);
    }
    return game;
  }

  public async createGame(game: CreateGameDto): Promise<Game> {
    return this.gameRepository.create(game);
  }
}