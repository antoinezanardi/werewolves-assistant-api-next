import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { FilterQuery, Types } from "mongoose";

import { convertGetGameHistoryDtoToMongooseQueryOptions } from "@/modules/game/helpers/game-history/game-history-record.mapper";
import type { GetGameHistoryDto } from "@/modules/game/dto/get-game-history/get-game-history.dto";
import { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import { GamePlayActions, WitchPotions } from "@/modules/game/enums/game-play.enum";
import type { GamePhases } from "@/modules/game/enums/game.enum";
import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GameHistoryRecordDocument, GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record.type";
import { RoleNames } from "@/modules/role/enums/role.enum";

@Injectable()
export class GameHistoryRecordRepository {
  public constructor(@InjectModel(GameHistoryRecord.name) private readonly gameHistoryRecordModel: Model<GameHistoryRecordDocument>) {}

  public async getGameHistory(gameId: Types.ObjectId, getGameHistoryDto: GetGameHistoryDto): Promise<GameHistoryRecord[]> {
    const queryOptions = convertGetGameHistoryDtoToMongooseQueryOptions(getGameHistoryDto);
    return this.gameHistoryRecordModel.find({ gameId }, undefined, queryOptions);
  }

  public async create(gameHistoryRecord: GameHistoryRecordToInsert): Promise<GameHistoryRecord> {
    return this.gameHistoryRecordModel.create(gameHistoryRecord);
  }

  public async getLastGameHistoryGuardProtectsRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GamePlayActions.PROTECT,
      "play.source.name": RoleNames.GUARD,
    };
    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }
  
  public async getLastGameHistoryTieInVotesRecord(gameId: Types.ObjectId, action: GamePlayActions): Promise<GameHistoryRecord | null> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": action,
      "play.voting.result": GameHistoryRecordVotingResults.TIE,
    };
    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }

  public async getGameHistoryWitchUsesSpecificPotionRecords(gameId: Types.ObjectId, potion: WitchPotions): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.source.name": RoleNames.WITCH,
      "play.action": GamePlayActions.USE_POTIONS,
      "play.targets.drankPotion": potion,
    };
    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryVileFatherOfWolvesInfectedRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GamePlayActions.EAT,
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

  public async getGameHistoryJudgeChoosesHisSignRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GamePlayActions.CHOOSE_SIGN,
      "play.source.name": RoleNames.STUTTERING_JUDGE,
    };
    return this.gameHistoryRecordModel.find(filter);
  }
  
  public async getGameHistoryWerewolvesEatElderRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GamePlayActions.EAT,
      "play.targets.player.role.current": RoleNames.ELDER,
    };
    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryElderProtectedFromWerewolvesRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      $or: [
        {
          "play.source.name": RoleNames.GUARD,
          "play.action": GamePlayActions.PROTECT,
          "play.targets.player.role.current": RoleNames.ELDER,
        },
        {
          "play.source.name": RoleNames.WITCH,
          "play.action": GamePlayActions.USE_POTIONS,
          "play.targets": {
            $elemMatch: {
              "player.role.current": RoleNames.ELDER,
              "drankPotion": WitchPotions.LIFE,
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

  public async getGameHistoryPhaseRecords(gameId: Types.ObjectId, turn: number, phase: GamePhases): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordModel.find({ gameId, turn, phase });
  }
}