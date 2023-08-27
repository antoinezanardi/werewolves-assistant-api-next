import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { FilterQuery, Types } from "mongoose";

import { GAME_HISTORY_RECORD_VOTING_RESULTS } from "@/modules/game/enums/game-history-record.enum";
import { GAME_PLAY_ACTIONS, WITCH_POTIONS } from "@/modules/game/enums/game-play.enum";
import type { GAME_PHASES } from "@/modules/game/enums/game.enum";
import type { GameHistoryRecordDocument } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record.type";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

@Injectable()
export class GameHistoryRecordRepository {
  public constructor(@InjectModel(GameHistoryRecord.name) private readonly gameHistoryRecordModel: Model<GameHistoryRecordDocument>) {}

  public async getGameHistory(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordModel.find({ gameId });
  }

  public async create(gameHistoryRecord: GameHistoryRecordToInsert): Promise<GameHistoryRecord> {
    return this.gameHistoryRecordModel.create(gameHistoryRecord);
  }

  public async getLastGameHistoryGuardProtectsRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GAME_PLAY_ACTIONS.PROTECT,
      "play.source.name": ROLE_NAMES.GUARD,
    };
    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }
  
  public async getLastGameHistoryTieInVotesRecord(gameId: Types.ObjectId, action: GAME_PLAY_ACTIONS): Promise<GameHistoryRecord | null> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": action,
      "play.voting.result": GAME_HISTORY_RECORD_VOTING_RESULTS.TIE,
    };
    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }

  public async getGameHistoryWitchUsesSpecificPotionRecords(gameId: Types.ObjectId, potion: WITCH_POTIONS): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.source.name": ROLE_NAMES.WITCH,
      "play.action": GAME_PLAY_ACTIONS.USE_POTIONS,
      "play.targets.drankPotion": potion,
    };
    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryVileFatherOfWolvesInfectedRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GAME_PLAY_ACTIONS.EAT,
      "play.targets.isInfected": true,
    };
    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryJudgeRequestRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.didJudgeRequestAnotherVote": true,
    };
    return this.gameHistoryRecordModel.find(filter);
  }
  
  public async getGameHistoryWerewolvesEatAncientRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GAME_PLAY_ACTIONS.EAT,
      "play.targets.player.role.current": ROLE_NAMES.ANCIENT,
    };
    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryAncientProtectedFromWerewolvesRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      $or: [
        {
          "play.source.name": ROLE_NAMES.GUARD,
          "play.action": GAME_PLAY_ACTIONS.PROTECT,
          "play.targets.player.role.current": ROLE_NAMES.ANCIENT,
        },
        {
          "play.source.name": ROLE_NAMES.WITCH,
          "play.action": GAME_PLAY_ACTIONS.USE_POTIONS,
          "play.targets": {
            $elemMatch: {
              "player.role.current": ROLE_NAMES.ANCIENT,
              "drankPotion": WITCH_POTIONS.LIFE,
            },
          },
        },
      ],
    };
    return this.gameHistoryRecordModel.find(filter);
  }
  
  public async getPreviousGameHistoryRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    const filter: FilterQuery<GameHistoryRecord> = { gameId };
    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }

  public async getGameHistoryPhaseRecords(gameId: Types.ObjectId, turn: number, phase: GAME_PHASES): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordModel.find({ gameId, turn, phase });
  }
}