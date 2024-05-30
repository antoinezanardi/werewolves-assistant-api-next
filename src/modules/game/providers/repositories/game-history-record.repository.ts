import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { FilterQuery, QueryOptions, Types } from "mongoose";
import { Model } from "mongoose";

import { GamePhaseName } from "@/modules/game/types/game-phase/game-phase.types";
import type { GetGameHistoryDto } from "@/modules/game/dto/get-game-history/get-game-history.dto";
import { convertGetGameHistoryDtoToMongooseQueryOptions } from "@/modules/game/helpers/game-history/game-history-record.mappers";
import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { GameHistoryRecordDocument, GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record/game-history-record.types";
import { GamePlayAction, WitchPotion } from "@/modules/game/types/game-play/game-play.types";

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
      "play.action": "protect",
      "play.source.name": "defender",
      "play.source.players": { $elemMatch: { _id: defenderPlayerId } },
    };

    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }

  public async getLastGameHistorySurvivorsVoteRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": "vote",
      "play.source.name": "survivors",
    };

    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }

  public async getLastGameHistoryTieInVotesRecord(gameId: Types.ObjectId, action: GamePlayAction): Promise<GameHistoryRecord | null> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": action,
      "play.voting.result": "tie",
    };

    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }

  public async getLastGameHistoryAccursedWolfFatherInfectsRecord(gameId: Types.ObjectId, accursedWolfFatherPlayerId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": "infect",
      "play.source.name": "accursed-wolf-father",
      "play.source.players": { $elemMatch: { _id: accursedWolfFatherPlayerId } },
    };

    return this.gameHistoryRecordModel.findOne(filter, undefined, { sort: { createdAt: -1 } });
  }

  public async getGameHistoryWitchUsesSpecificPotionRecords(gameId: Types.ObjectId, witchPlayerId: Types.ObjectId, potion: WitchPotion): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": "use-potions",
      "play.source.name": "witch",
      "play.source.players": { $elemMatch: { _id: witchPlayerId } },
      "play.targets.drankPotion": potion,
    };

    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryAccursedWolfFatherInfectsWithTargetRecords(gameId: Types.ObjectId, accursedWolfFatherPlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": "infect",
      "play.source.name": "accursed-wolf-father",
      "play.source.players": { $elemMatch: { _id: accursedWolfFatherPlayerId } },
      "play.targets": { $exists: true, $ne: [] },
    };

    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryStutteringJudgeRequestsAnotherVoteRecords(gameId: Types.ObjectId, stutteringJudgePlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.source.name": "stuttering-judge",
      "play.source.players": { $elemMatch: { _id: stutteringJudgePlayerId } },
      "play.didJudgeRequestAnotherVote": true,
    };

    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryWerewolvesEatElderRecords(gameId: Types.ObjectId, elderPlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": "eat",
      "play.targets": {
        $elemMatch: {
          "player._id": elderPlayerId,
          "player.role.current": "elder",
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
          "play.source.name": "defender",
          "play.action": "protect",
          "play.targets": {
            $elemMatch: {
              "player._id": elderPlayerId,
              "player.role.current": "elder",
            },
          },
        },
        {
          "play.source.name": "witch",
          "play.action": "use-potions",
          "play.targets": {
            $elemMatch: {
              "player._id": elderPlayerId,
              "player.role.current": "elder",
              "drankPotion": "life",
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

  public async getGameHistoryRecordsForTurnAndPhases(gameId: Types.ObjectId, turn: number, phaseNames: GamePhaseName[]): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      turn,
      "phase.name": { $in: phaseNames },
    };

    return this.gameHistoryRecordModel.find(filter);
  }

  public async getGameHistoryGamePlayRecords(gameId: Types.ObjectId, gamePlay: GamePlay, options: QueryOptions<GameHistoryRecord> = {}): Promise<GameHistoryRecord[]> {
    const filter: FilterQuery<GameHistoryRecord> = {
      gameId,
      "play.action": gamePlay.action,
      "play.source.name": gamePlay.source.name,
      "play.causes": gamePlay.causes,
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
      "play.causes": gamePlay.causes,
    };

    return this.gameHistoryRecordModel.find(filter, undefined, options);
  }
}