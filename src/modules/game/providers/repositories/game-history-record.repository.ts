import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Types } from "mongoose";
import { Model } from "mongoose";
import { ROLE_NAMES } from "../../../role/enums/role.enum";
import { GAME_HISTORY_RECORD_VOTING_RESULTS } from "../../enums/game-history-record.enum";
import { GAME_PLAY_ACTIONS, WITCH_POTIONS } from "../../enums/game-play.enum";
import type { GameHistoryRecordDocument } from "../../schemas/game-history-record/game-history-record.schema";
import { GameHistoryRecord } from "../../schemas/game-history-record/game-history-record.schema";
import type { GameHistoryRecordToInsert } from "../../types/game-history-record.type";

@Injectable()
export class GameHistoryRecordRepository {
  public constructor(@InjectModel(GameHistoryRecord.name) private readonly gameHistoryRecordModel: Model<GameHistoryRecordDocument>) {}

  public async create(gameHistoryRecord: GameHistoryRecordToInsert): Promise<GameHistoryRecord> {
    return this.gameHistoryRecordModel.create(gameHistoryRecord);
  }

  public async getLastGameHistoryGuardProtectsRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    const filter: Record<string, unknown> = {
      gameId,
      "play.action": GAME_PLAY_ACTIONS.PROTECT,
      "play.source.name": ROLE_NAMES.GUARD,
    };
    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }
  
  public async getLastGameHistoryTieInVotesRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    const filter: Record<string, unknown> = {
      gameId,
      "play.action": GAME_PLAY_ACTIONS.VOTE,
      "votingResult": GAME_HISTORY_RECORD_VOTING_RESULTS.TIE,
    };
    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }

  public async getGameHistoryWitchUsesLifePotionRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordModel.find({ gameId, targets: { $elemMatch: { drankPotion: WITCH_POTIONS.LIFE } } });
  }

  public async getGameHistoryWitchUsesDeathPotionRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordModel.find({ gameId, targets: { $elemMatch: { drankPotion: WITCH_POTIONS.DEATH } } });
  }

  public async getGameHistoryVileFatherOfWolvesInfectedRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordModel.find({ gameId, targets: { $elemMatch: { isInfected: true } } });
  }

  public async getGameHistoryJudgeRequestRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordModel.find({ gameId, play: { didJudgeRequestAnotherVote: true } });
  }
}