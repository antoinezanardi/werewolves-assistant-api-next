import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import type { Types } from "mongoose";
import { API_RESOURCES } from "../../../../../shared/api/enums/api.enum";
import { RESOURCE_NOT_FOUND_REASONS } from "../../../../../shared/exception/enums/resource-not-found-error.enum";
import { createNoCurrentGamePlayUnexpectedException } from "../../../../../shared/exception/helpers/unexpected-exception.factory";
import { ResourceNotFoundException } from "../../../../../shared/exception/types/resource-not-found-exception.type";
import { plainToInstanceDefaultOptions } from "../../../../../shared/validation/constants/validation.constant";
import type { MakeGamePlayWithRelationsDto } from "../../../dto/make-game-play/make-game-play-with-relations.dto";
import type { WITCH_POTIONS } from "../../../enums/game-play.enum";
import { getAdditionalCardWithId, getExpectedPlayersToPlay, getNonexistentPlayer, getPlayerWithId } from "../../../helpers/game.helper";
import { GameHistoryRecordPlay } from "../../../schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import type { GameHistoryRecord } from "../../../schemas/game-history-record/game-history-record.schema";
import type { Game } from "../../../schemas/game.schema";
import type { Player } from "../../../schemas/player/player.schema";
import { GameHistoryRecordToInsert } from "../../../types/game-history-record.type";
import { GameHistoryRecordRepository } from "../../repositories/game-history-record.repository";
import { GameRepository } from "../../repositories/game.repository";

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

  public async getLastGameHistoryGuardProtectsRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    return this.gameHistoryRecordRepository.getLastGameHistoryGuardProtectsRecord(gameId);
  }

  public async getLastGameHistoryTieInVotesRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    return this.gameHistoryRecordRepository.getLastGameHistoryTieInVotesRecord(gameId);
  }

  public async getGameHistoryWitchUsesSpecificPotionRecords(gameId: Types.ObjectId, potion: WITCH_POTIONS): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryWitchUsesSpecificPotionRecords(gameId, potion);
  }

  public async getGameHistoryVileFatherOfWolvesInfectedRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryVileFatherOfWolvesInfectedRecords(gameId);
  }

  public async getGameHistoryJudgeRequestRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryJudgeRequestRecords(gameId);
  }

  public async getGameHistoryWerewolvesEatAncientRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryWerewolvesEatAncientRecords(gameId);
  }

  public async getGameHistoryAncientProtectedFromWerewolvesRecords(gameId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryAncientProtectedFromWerewolvesRecords(gameId);
  }

  public async getPreviousGameHistoryRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    return this.gameHistoryRecordRepository.getPreviousGameHistoryRecord(gameId);
  }
  
  public generateCurrentGameHistoryRecordToInsert(baseGame: Game, newGame: Game, play: MakeGamePlayWithRelationsDto): GameHistoryRecordToInsert {
    const gameHistoryRecordToInsert: GameHistoryRecordToInsert = {
      gameId: baseGame._id,
      turn: baseGame.turn,
      phase: baseGame.phase,
      tick: baseGame.tick,
      play: this.generateCurrentGameHistoryRecordPlayToInsert(baseGame, play),
      revealedPlayers: this.generateCurrentGameHistoryRecordRevealedPlayersToInsert(baseGame, newGame),
      deadPlayers: this.generateCurrentGameHistoryRecordDeadPlayersToInsert(baseGame, newGame),
    };
    // TODO: add play.voting
    return plainToInstance(GameHistoryRecordToInsert, gameHistoryRecordToInsert, plainToInstanceDefaultOptions);
  }

  private generateCurrentGameHistoryRecordDeadPlayersToInsert(baseGame: Game, newGame: Game): Player[] | undefined {
    const { players: basePlayers } = baseGame;
    const { players: newPlayers } = newGame;
    const currentDeadPlayers = newPlayers.filter(player => {
      const matchingBasePlayer = getPlayerWithId(basePlayers, player._id);
      return matchingBasePlayer?.isAlive === true && !player.isAlive;
    });
    return currentDeadPlayers.length ? currentDeadPlayers : undefined;
  }

  private generateCurrentGameHistoryRecordRevealedPlayersToInsert(baseGame: Game, newGame: Game): Player[] | undefined {
    const { players: basePlayers } = baseGame;
    const { players: newPlayers } = newGame;
    const currentRevealedPlayers = newPlayers.filter(player => {
      const matchingBasePlayer = getPlayerWithId(basePlayers, player._id);
      return matchingBasePlayer?.role.isRevealed === false && player.role.isRevealed && player.isAlive;
    });
    return currentRevealedPlayers.length ? currentRevealedPlayers : undefined;
  }
  
  private generateCurrentGameHistoryRecordPlayToInsert(baseGame: Game, play: MakeGamePlayWithRelationsDto): GameHistoryRecordPlay {
    if (baseGame.currentPlay === null) {
      throw createNoCurrentGamePlayUnexpectedException("generateCurrentGameHistoryRecordPlayToInsert", { gameId: baseGame._id });
    }
    const gameHistoryRecordPlayToInsert: GameHistoryRecordPlay = {
      source: {
        name: baseGame.currentPlay.source,
        players: getExpectedPlayersToPlay(baseGame),
      },
      action: baseGame.currentPlay.action,
      didJudgeRequestAnotherVote: play.doesJudgeRequestAnotherVote,
      targets: play.targets,
      votes: play.votes,
      chosenCard: play.chosenCard,
      chosenSide: play.chosenSide,
    };
    return plainToInstance(GameHistoryRecordPlay, gameHistoryRecordPlayToInsert, plainToInstanceDefaultOptions);
  }

  private validateGameHistoryRecordToInsertPlayData(play: GameHistoryRecordPlay, game: Game): void {
    const unmatchedSource = getNonexistentPlayer(game.players, play.source.players);
    if (unmatchedSource) {
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, unmatchedSource._id.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_SOURCE);
    }
    const unmatchedTarget = getNonexistentPlayer(game.players, play.targets?.map(target => target.player));
    if (unmatchedTarget) {
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, unmatchedTarget._id.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_TARGET);
    }
    const unmatchedVoter = getNonexistentPlayer(game.players, play.votes?.map(vote => vote.source));
    if (unmatchedVoter) {
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, unmatchedVoter._id.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_VOTE_SOURCE);
    }
    const unmatchedVoteTarget = getNonexistentPlayer(game.players, play.votes?.map(vote => vote.target));
    if (unmatchedVoteTarget) {
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, unmatchedVoteTarget._id.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_VOTE_TARGET);
    }
    if (play.chosenCard && !getAdditionalCardWithId(game.additionalCards, play.chosenCard._id)) {
      throw new ResourceNotFoundException(API_RESOURCES.GAME_ADDITIONAL_CARDS, play.chosenCard._id.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_CHOSEN_CARD);
    }
  }

  private async validateGameHistoryRecordToInsertData(gameHistoryRecordToInsert: GameHistoryRecordToInsert): Promise<void> {
    const { gameId, play, revealedPlayers, deadPlayers } = gameHistoryRecordToInsert;
    const game = await this.gameRepository.findOne({ _id: gameId });
    if (game === null) {
      throw new ResourceNotFoundException(API_RESOURCES.GAMES, gameId.toString(), RESOURCE_NOT_FOUND_REASONS.UNKNOWN_GAME_PLAY_GAME_ID);
    }
    const unmatchedRevealedPlayer = getNonexistentPlayer(game.players, revealedPlayers);
    if (unmatchedRevealedPlayer) {
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, unmatchedRevealedPlayer._id.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_REVEALED_PLAYER);
    }
    const unmatchedDeadPlayer = getNonexistentPlayer(game.players, deadPlayers);
    if (unmatchedDeadPlayer) {
      throw new ResourceNotFoundException(API_RESOURCES.PLAYERS, unmatchedDeadPlayer._id.toString(), RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_DEAD_PLAYER);
    }
    this.validateGameHistoryRecordToInsertPlayData(play, game);
  }
}