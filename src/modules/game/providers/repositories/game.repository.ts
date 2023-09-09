import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { FilterQuery, QueryOptions } from "mongoose";

import type { GameDocument } from "@/modules/game/types/game.type";
import type { CreateGameDto } from "@/modules/game/dto/create-game/create-game.dto";
import { Game } from "@/modules/game/schemas/game.schema";

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