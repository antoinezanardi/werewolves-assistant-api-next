import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { FilterQuery } from "mongoose";
import { Model } from "mongoose";
import type { GameHistoryRecordDocument } from "../../schemas/game-history-record/game-history-record.schema";
import { GameHistoryRecord } from "../../schemas/game-history-record/game-history-record.schema";
import type { GameHistoryRecordToInsert } from "../../types/game-history-record.type";

@Injectable()
export class GameHistoryRecordRepository {
  public constructor(@InjectModel(GameHistoryRecord.name) private readonly gameHistoryRecordModel: Model<GameHistoryRecordDocument>) {}
  public async find(filter: FilterQuery<GameHistoryRecordDocument> = {}): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordModel.find(filter);
  }

  public async create(gameHistoryRecord: GameHistoryRecordToInsert): Promise<GameHistoryRecord> {
    return this.gameHistoryRecordModel.create(gameHistoryRecord);
  }
}