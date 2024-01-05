import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { FilterQuery, Types, QueryOptions } from "mongoose";

import { PlayerGroups } from "@/modules/game/enums/player.enum";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
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

  public async getLastGameHistoryDefenderProtectsRecord(gameId: Types.ObjectId, defenderPlayerId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GamePlayActions.PROTECT,
      "play.source.name": RoleNames.DEFENDER,
      "play.source.players": { $elemMatch: { _id: defenderPlayerId } },
    };
    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }

  public async getLastGameHistorySurvivorsVoteRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GamePlayActions.VOTE,
      "play.source.name": PlayerGroups.SURVIVORS,
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

  public async getLastGameHistoryAccursedWolfFatherInfectsRecord(gameId: Types.ObjectId, accursedWolfFatherPlayerId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GamePlayActions.INFECT,
      "play.source.name": RoleNames.ACCURSED_WOLF_FATHER,
      "play.source.players": { $elemMatch: { _id: accursedWolfFatherPlayerId } },
    };
    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }

  public async getGameHistoryWitchUsesSpecificPotionRecords(gameId: Types.ObjectId, witchPlayerId: Types.ObjectId, potion: WitchPotions): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GamePlayActions.USE_POTIONS,
      "play.source.name": RoleNames.WITCH,
      "play.source.players": { $elemMatch: { _id: witchPlayerId } },
      "play.targets.drankPotion": potion,
    };
    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryAccursedWolfFatherInfectsWithTargetRecords(gameId: Types.ObjectId, accursedWolfFatherPlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GamePlayActions.INFECT,
      "play.source.name": RoleNames.ACCURSED_WOLF_FATHER,
      "play.source.players": { $elemMatch: { _id: accursedWolfFatherPlayerId } },
      "play.targets": { $exists: true, $ne: [] },
    };
    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryJudgeRequestRecords(gameId: Types.ObjectId, stutteringJudgePlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.source.players": {
        $elemMatch: {
          "_id": stutteringJudgePlayerId,
          "role.current": RoleNames.STUTTERING_JUDGE,
        },
      },
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
  
  public async getGameHistoryWerewolvesEatElderRecords(gameId: Types.ObjectId, elderPlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": GamePlayActions.EAT,
      "play.targets": {
        $elemMatch: {
          "player._id": elderPlayerId,
          "player.role.current": RoleNames.ELDER,
        },
      },
    };
    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryElderProtectedFromWerewolvesRecords(gameId: Types.ObjectId, elderPlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      $or: [
        {
          "play.source.name": RoleNames.DEFENDER,
          "play.action": GamePlayActions.PROTECT,
          "play.targets": {
            $elemMatch: {
              "player._id": elderPlayerId,
              "player.role.current": RoleNames.ELDER,
            },
          },
        },
        {
          "play.source.name": RoleNames.WITCH,
          "play.action": GamePlayActions.USE_POTIONS,
          "play.targets": {
            $elemMatch: {
              "player._id": elderPlayerId,
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

  public async getGameHistoryGamePlayRecords(gameId: Types.ObjectId, gamePlay: GamePlay, options: QueryOptions<GameHistoryRecord> = {}): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": gamePlay.action,
      "play.source.name": gamePlay.source.name,
      "play.cause": gamePlay.cause,
    };
    return this.gameHistoryRecordModel.find(filter, undefined, options);
  }

  public async getGameHistoryGamePlayMadeByPlayerRecords(
    gameId: Types.ObjectId,
    gamePlay: GamePlay,
    player: Player,
    options: QueryOptions<GameHistoryRecord> = {},
  ): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": gamePlay.action,
      "play.source.name": gamePlay.source.name,
      "play.source.players": { $elemMatch: { _id: player._id } },
      "play.cause": gamePlay.cause,
    };
    return this.gameHistoryRecordModel.find(filter, undefined, options);
  }
}