import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import type { Types } from "mongoose";

import type { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { GetGameHistoryDto } from "@/modules/game/dto/get-game-history/get-game-history.dto";
import type { MakeGamePlayWithRelationsDto } from "@/modules/game/dto/make-game-play/make-game-play-with-relations.dto";
import { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import type { WitchPotions } from "@/modules/game/enums/game-play.enum";
import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import type { GamePhases } from "@/modules/game/enums/game.enum";
import { PlayerAttributeNames, PlayerDeathCauses } from "@/modules/game/enums/player.enum";
import { getAdditionalCardWithId, getNonexistentPlayer, getPlayerWithActiveAttributeName, getPlayerWithId } from "@/modules/game/helpers/game.helper";
import { GameHistoryRecordRepository } from "@/modules/game/providers/repositories/game-history-record.repository";
import { GameRepository } from "@/modules/game/providers/repositories/game.repository";
import { GamePlayVoteService } from "@/modules/game/providers/services/game-play/game-play-vote/game-play-vote.service";
import { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";
import { GameHistoryRecordPlayVoting } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";
import { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import type { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { Game } from "@/modules/game/schemas/game.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record.type";
import type { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { ApiResources } from "@/shared/api/enums/api.enum";
import { ResourceNotFoundReasons } from "@/shared/exception/enums/resource-not-found-error.enum";
import { createNoCurrentGamePlayUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.type";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

@Injectable()
export class GameHistoryRecordService {
  public constructor(
    private readonly gamePlayVoteService: GamePlayVoteService,
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

  public async getLastGameHistoryTieInVotesRecord(gameId: Types.ObjectId, action: GamePlayActions): Promise<GameHistoryRecord | null> {
    return this.gameHistoryRecordRepository.getLastGameHistoryTieInVotesRecord(gameId, action);
  }

  public async getGameHistoryWitchUsesSpecificPotionRecords(gameId: Types.ObjectId, witchPlayerId: Types.ObjectId, potion: WitchPotions): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryWitchUsesSpecificPotionRecords(gameId, witchPlayerId, potion);
  }

  public async getGameHistoryAccursedWolfFatherInfectedRecords(gameId: Types.ObjectId, accursedWolfFatherPlayer: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryAccursedWolfFatherInfectedRecords(gameId, accursedWolfFatherPlayer);
  }

  public async getGameHistoryJudgeRequestRecords(gameId: Types.ObjectId, stutteringJudgePlayedId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryJudgeRequestRecords(gameId, stutteringJudgePlayedId);
  }

  public async didJudgeMakeHisSign(gameId: Types.ObjectId): Promise<boolean> {
    const records = await this.gameHistoryRecordRepository.getGameHistoryJudgeChoosesHisSignRecords(gameId);
    return records.length > 0;
  }

  public async getGameHistoryWerewolvesEatElderRecords(gameId: Types.ObjectId, elderPlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryWerewolvesEatElderRecords(gameId, elderPlayerId);
  }

  public async getGameHistoryElderProtectedFromWerewolvesRecords(gameId: Types.ObjectId, elderPlayerId: Types.ObjectId): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryElderProtectedFromWerewolvesRecords(gameId, elderPlayerId);
  }

  public async getGameHistoryPhaseRecords(gameId: Types.ObjectId, turn: number, phase: GamePhases): Promise<GameHistoryRecord[]> {
    return this.gameHistoryRecordRepository.getGameHistoryPhaseRecords(gameId, turn, phase);
  }

  public async getPreviousGameHistoryRecord(gameId: Types.ObjectId): Promise<GameHistoryRecord | null> {
    return this.gameHistoryRecordRepository.getPreviousGameHistoryRecord(gameId);
  }
  
  public generateCurrentGameHistoryRecordToInsert(baseGame: Game, newGame: Game, play: MakeGamePlayWithRelationsDto): GameHistoryRecordToInsert {
    if (baseGame.currentPlay === null) {
      throw createNoCurrentGamePlayUnexpectedException("generateCurrentGameHistoryRecordToInsert", { gameId: baseGame._id });
    }
    const gameHistoryRecordToInsert: GameHistoryRecordToInsert = {
      gameId: baseGame._id,
      turn: baseGame.turn,
      phase: baseGame.phase,
      tick: baseGame.tick,
      play: this.generateCurrentGameHistoryRecordPlayToInsert(baseGame as GameWithCurrentPlay, play),
      revealedPlayers: this.generateCurrentGameHistoryRecordRevealedPlayersToInsert(baseGame, newGame),
      deadPlayers: this.generateCurrentGameHistoryRecordDeadPlayersToInsert(baseGame, newGame),
    };
    gameHistoryRecordToInsert.play.voting = this.generateCurrentGameHistoryRecordPlayVotingToInsert(baseGame as GameWithCurrentPlay, newGame, gameHistoryRecordToInsert);
    return plainToInstance(GameHistoryRecordToInsert, gameHistoryRecordToInsert, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
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

  private generateCurrentGameHistoryRecordDeadPlayersToInsert(baseGame: Game, newGame: Game): DeadPlayer[] | undefined {
    const { players: newPlayers } = newGame;
    const currentDeadPlayers = newPlayers.filter(player => {
      const matchingBasePlayer = getPlayerWithId(baseGame, player._id);
      return matchingBasePlayer?.isAlive === true && !player.isAlive;
    }) as DeadPlayer[];
    return currentDeadPlayers.length ? currentDeadPlayers : undefined;
  }

  private generateCurrentGameHistoryRecordRevealedPlayersToInsert(baseGame: Game, newGame: Game): Player[] | undefined {
    const { players: newPlayers } = newGame;
    const currentRevealedPlayers = newPlayers.filter(player => {
      const matchingBasePlayer = getPlayerWithId(baseGame, player._id);
      return matchingBasePlayer?.role.isRevealed === false && player.role.isRevealed && player.isAlive;
    });
    return currentRevealedPlayers.length ? currentRevealedPlayers : undefined;
  }
  
  private generateCurrentGameHistoryRecordPlayToInsert(baseGame: GameWithCurrentPlay, play: MakeGamePlayWithRelationsDto): GameHistoryRecordPlay {
    const gameHistoryRecordPlayToInsert: GameHistoryRecordPlay = {
      source: this.generateCurrentGameHistoryRecordPlaySourceToInsert(baseGame),
      action: baseGame.currentPlay.action,
      cause: baseGame.currentPlay.cause,
      didJudgeRequestAnotherVote: play.doesJudgeRequestAnotherVote,
      targets: play.targets,
      votes: play.votes,
      chosenCard: play.chosenCard,
      chosenSide: play.chosenSide,
    };
    return plainToInstance(GameHistoryRecordPlay, toJSON(gameHistoryRecordPlayToInsert), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
  }
  
  private generateCurrentGameHistoryRecordPlayVotingResultToInsert(
    baseGame: GameWithCurrentPlay,
    newGame: Game,
    nominatedPlayers: Player[],
    gameHistoryRecordToInsert: GameHistoryRecordToInsert,
  ): GameHistoryRecordVotingResults {
    const sheriffPlayer = getPlayerWithActiveAttributeName(newGame, PlayerAttributeNames.SHERIFF);
    const areSomePlayersDeadFromCurrentVotes = gameHistoryRecordToInsert.deadPlayers?.some(({ death }) => {
      const deathFromVoteCauses = [PlayerDeathCauses.VOTE, PlayerDeathCauses.VOTE_SCAPEGOATED];
      return deathFromVoteCauses.includes(death.cause);
    }) === true;
    if (baseGame.currentPlay.action === GamePlayActions.ELECT_SHERIFF) {
      return sheriffPlayer ? GameHistoryRecordVotingResults.SHERIFF_ELECTION : GameHistoryRecordVotingResults.TIE;
    }
    if (!gameHistoryRecordToInsert.play.votes || gameHistoryRecordToInsert.play.votes.length === 0) {
      return GameHistoryRecordVotingResults.SKIPPED;
    }
    if (areSomePlayersDeadFromCurrentVotes) {
      return GameHistoryRecordVotingResults.DEATH;
    }
    if (baseGame.currentPlay.cause === GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES || nominatedPlayers.length === 1) {
      return GameHistoryRecordVotingResults.INCONSEQUENTIAL;
    }
    return GameHistoryRecordVotingResults.TIE;
  }

  private generateCurrentGameHistoryRecordPlayVotingToInsert(
    baseGame: GameWithCurrentPlay,
    newGame: Game,
    gameHistoryRecordToInsert: GameHistoryRecordToInsert,
  ): GameHistoryRecordPlayVoting {
    const nominatedPlayers = this.gamePlayVoteService.getNominatedPlayers(gameHistoryRecordToInsert.play.votes, baseGame);
    const gameHistoryRecordPlayVoting: GameHistoryRecordPlayVoting = {
      result: this.generateCurrentGameHistoryRecordPlayVotingResultToInsert(baseGame, newGame, nominatedPlayers, gameHistoryRecordToInsert),
      nominatedPlayers: nominatedPlayers.length ? nominatedPlayers : undefined,
    };
    return plainToInstance(GameHistoryRecordPlayVoting, gameHistoryRecordPlayVoting, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
  }
  
  private generateCurrentGameHistoryRecordPlaySourceToInsert(baseGame: GameWithCurrentPlay): GameHistoryRecordPlaySource {
    return plainToInstance(GameHistoryRecordPlaySource, toJSON(baseGame.currentPlay.source), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
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