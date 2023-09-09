import type { ApiPropertyOptions } from "@nestjs/swagger";

import type { GameHistoryRecordPlayVote } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote/game-history-record-play-vote.schema";

const GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS = Object.freeze<Record<keyof GameHistoryRecordPlayVote, ApiPropertyOptions>>({
  source: { required: true },
  target: { required: true },
});

const GAME_HISTORY_RECORD_PLAY_VOTE_API_PROPERTIES = Object.freeze<Record<keyof GameHistoryRecordPlayVote, ApiPropertyOptions>>({
  source: {
    description: "Player who made the vote",
    ...GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS.source,
  },
  target: {
    description: "Player targeted by the vote",
    ...GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS.target,
  },
});

export {
  GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_VOTE_API_PROPERTIES,
};