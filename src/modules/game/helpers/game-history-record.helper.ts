import { GAME_HISTORY_RECORD_VOTING_RESULTS } from "../enums/game-history-record.enum";
import { GAME_PLAY_ACTIONS } from "../enums/game-play.enum";
import type { GameHistoryRecord } from "../schemas/game-history-record/game-history-record.schema";
import type { GameSource } from "../types/game.type";

function getLastGamePlayFromHistory(gameHistoryRecords: GameHistoryRecord[], source: GameSource, action: GAME_PLAY_ACTIONS): GameHistoryRecord | undefined {
  return gameHistoryRecords.findLast(({ play }) => play.action === action && play.source.name === source);
}

function getLastGamePlayTieInVotesFromHistory(gameHistoryRecords: GameHistoryRecord[]): GameHistoryRecord | undefined {
  return gameHistoryRecords.findLast(({ play }) => play.action === GAME_PLAY_ACTIONS.VOTE && play.votingResult === GAME_HISTORY_RECORD_VOTING_RESULTS.TIE);
}

export {
  getLastGamePlayFromHistory,
  getLastGamePlayTieInVotesFromHistory,
};