import { Injectable } from "@nestjs/common";
import type { CreateGameDto } from "./dto/create-game/create-game.dto";
import { GameRepository } from "./game.repository";
import type { Game } from "./schemas/game.schema";

@Injectable()
export class GameService {
  public constructor(private readonly gameRepository: GameRepository) {}
  public async getGames(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  public async createGame(game: CreateGameDto): Promise<Game> {
    return this.gameRepository.create(game);
  }
}