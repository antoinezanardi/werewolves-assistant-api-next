import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { FilterQuery } from "mongoose";
import { Model } from "mongoose";
import type { CreateGameDto } from "./dto/create-game/create-game.dto";
import type { GameDocument } from "./schemas/game.schema";
import { Game } from "./schemas/game.schema";

@Injectable()
export class GameRepository {
  public constructor(@InjectModel(Game.name) private readonly gameModel: Model<GameDocument>) {}
  public async find(filter: FilterQuery<GameDocument> = {}): Promise<Game[]> {
    return this.gameModel.find(filter).exec();
  }

  public async create(game: CreateGameDto): Promise<Game> {
    return this.gameModel.create(game);
  }
}