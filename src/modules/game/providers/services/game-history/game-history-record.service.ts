import type { GetGameHistoryDto } from "@/modules/game/dto/get-game-history/get-game-history.dto";
import { getAdditionalCardWithId, getNonexistentPlayer } from "@/modules/game/helpers/game.helpers";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record/game-history-record.repository";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record/game-history-record.types";
import { GamePhaseName } from "@/modules/game/types/game-phase/game-phase.types";
import { GamePlayAction, WitchPotion } from "@/modules/game/types/game-play/game-play.types";

import { ApiResources } from "@/shared/api/enums/api.enums";
import { ResourceNotFoundReasons } from "@/shared/exception/enums/resource-not-found-error.enum";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.types";
import { Injectable } from "@nestjs/common";
import type { Types } from "mongoose";

@Injectable()
export class GameHistoryRecordService {
  public constructor(
    private readonly gameHistoryRecordRepository: GameHistoryRecordRepository,
    private readonly gameRepository: GameRepository,
  ) {}

  public async createGameHistoryRecord(gameHistoryRecordToInsert: GameHistoryRecordToInsert): Promise<GameHistoryRecord> {
    await this.validateGameHistoryRecordToInsertData(gameHistoryRecordToInsert);

    return this.gameHistoryRecordRepository.create(gameHistoryRecordToInsert);
  }

  public async getLastGameHistoryDefenderProtectsRecord(gameId: Types.ObjectId, defenderPlayerId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    return this.gameHistoryRecordRepository.getLastGameHistoryDefenderProtectsRecord(gameId, defenderPlayerId);
  }

  public async getLastGameHistorySurvivorsVoteRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    return this.gameHistoryRecordRepository.getLastGameHistorySurvivorsVoteRecord(gameId);
  }

  public async getLastGameHistoryTieInVotesRecord(gameId: Types.ObjectId, action: GamePlayAction): Promise<GameHistoryRecord | null> {
    return this.gameHistoryRecordRepository.getLastGameHistoryTieInVotesRecord(gameId, action);
  }

  public async getLastGameHistoryAccursedWolfFatherInfectsRecord(gameId: Types.ObjectId, accursedWolfFatherPlayerId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    return this.gameHistoryRecordRepository.getLastGameHistoryAccursedWolfFatherInfectsRecord(gameId, accursedWolfFatherPlayerId);
  }

  public async getGameHistoryWitchUsesSpecificPotionRecords(gameId: Types.ObjectId, witchPlayerId: Types.ObjectId, potion: WitchPotion): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, potion);
  }

  public async getGameHistoryAccursedWolfFatherInfectsWithTargetRecords(gameId: Types.ObjectId, accursedWolfFatherPlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryAccursedWolfFatherInfectsWithTargetRecords(gameId, accursedWolfFatherPlayerId);
  }

  public async getGameHistoryStutteringJudgeRequestsAnotherVoteRecords(gameId: Types.ObjectId, stutteringJudgePlayedId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryStutteringJudgeRequestsAnotherVoteRecords(gameId, stutteringJudgePlayedId);
  }

  public async getGameHistoryWerewolvesEatElderRecords(gameId: Types.ObjectId, elderPlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryWerewolvesEatElderRecords(gameId, elderPlayerId);
  }

  public async getGameHistoryElderProtectedFromWerewolvesRecords(gameId: Types.ObjectId, elderPlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryElderProtectedFromWerewolvesRecords(gameId, elderPlayerId);
  }

  public async getGameHistoryRecordsForTurnAndPhases(gameId: Types.ObjectId, turn: number, phases: GamePhaseName[]): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryRecordsForTurnAndPhases(gameId, turn, phases);
  }

  public async getPreviousGameHistoryRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    return this.gameHistoryRecordRepository.getPreviousGameHistoryRecord(gameId);
  }

  public async getGameHistory(gameId: Types.ObjectId, getGameHistoryDto: GetGameHistoryDto): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistory(gameId, getGameHistoryDto);
  }

  public async hasGamePlayBeenMade(gameId: Types.ObjectId, gamePlay: GamePlay): Promise<boolean> {
    const records = await this.gameHistoryRecordRepository.getGameHistoryGamePlayRecords(gameId, gamePlay, { limit: 1 });

    return records.length > 0;
  }

  public async hasGamePlayBeenMadeByPlayer(gameId: Types.ObjectId, gamePlay: GamePlay, player: Player): Promise<boolean> {
    const records = await this.gameHistoryRecordRepository.getGameHistoryGamePlayMadeByPlayerRecords(gameId, gamePlay, player, { limit: 1 });

    return records.length > 0;
  }

  private validateGameHistoryRecordToInsertPlayData(play: GameHistoryRecordPlay, game: Game): void {
    const unmatchedSource = getNonexistentPlayer(game, play.source.players);
    if (unmatchedSource) {
      throw new ResourceNotFoundException(ApiResources.PLAYERS, unmatchedSource._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_SOURCE);
    }
    const unmatchedTarget = getNonexistentPlayer(game, play.targets?.map(target => target.player));
    if (unmatchedTarget) {
      throw new ResourceNotFoundException(ApiResources.PLAYERS, unmatchedTarget._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_TARGET);
    }
    const unmatchedVoter = getNonexistentPlayer(game, play.votes?.map(vote => vote.source));
    if (unmatchedVoter) {
      throw new ResourceNotFoundException(ApiResources.PLAYERS, unmatchedVoter._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_VOTE_SOURCE);
    }
    const unmatchedVoteTarget = getNonexistentPlayer(game, play.votes?.map(vote => vote.target));
    if (unmatchedVoteTarget) {
      throw new ResourceNotFoundException(ApiResources.PLAYERS, unmatchedVoteTarget._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_VOTE_TARGET);
    }
    if (play.chosenCard && !getAdditionalCardWithId(game.additionalCards, play.chosenCard._id)) {
      throw new ResourceNotFoundException(ApiResources.GAME_ADDITIONAL_CARDS, play.chosenCard._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_CHOSEN_CARD);
    }
  }

  private async validateGameHistoryRecordToInsertData(gameHistoryRecordToInsert: GameHistoryRecordToInsert): Promise<void> {
    const { gameId, play, revealedPlayers, deadPlayers } = gameHistoryRecordToInsert;
    const game = await this.gameRepository.findOne({ _id: gameId });
    if (game === null) {
      throw new ResourceNotFoundException(ApiResources.GAMES, gameId.toString(), ResourceNotFoundReasons.UNKNOWN_GAME_PLAY_GAME_ID);
    }
    const unmatchedRevealedPlayer = getNonexistentPlayer(game, revealedPlayers);
    if (unmatchedRevealedPlayer) {
      throw new ResourceNotFoundException(ApiResources.PLAYERS, unmatchedRevealedPlayer._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_REVEALED_PLAYER);
    }
    const unmatchedDeadPlayer = getNonexistentPlayer(game, deadPlayers);
    if (unmatchedDeadPlayer) {
      throw new ResourceNotFoundException(ApiResources.PLAYERS, unmatchedDeadPlayer._id.toString(), ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_DEAD_PLAYER);
    }
    this.validateGameHistoryRecordToInsertPlayData(play, game);
  }
}