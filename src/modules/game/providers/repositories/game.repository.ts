import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { FilterQuery, QueryOptions } from "mongoose";
import { Model } from "mongoose";
import type { CreateGameDto } from "../../dto/create-game/create-game.dto";
import type { GameDocument } from "../../schemas/game.schema";
import { Game } from "../../schemas/game.schema";

@Injectable()
export class GameRepository {
  public constructor(@InjectModel(Game.name) private readonly gameModel: Model<GameDocument>) {}
  public async find(filter: FilterQuery<GameDocument> = {}): Promise<Game[]> {
    return this.gameModel.find(filter);
  }

  public async findOne(filter: FilterQuery<GameDocument>): Promise<Game | null> {
    return this.gameModel.findOne(filter);
  }

  public async create(game: CreateGameDto): Promise<Game> {
    return this.gameModel.create(game);
  }

  public async updateOne(filter: FilterQuery<GameDocument>, game: Partial<Game>, options: QueryOptions = {}): Promise<Game | null> {
    return this.gameModel.findOneAndUpdate(filter, game, { new: true, ...options });
  }
}