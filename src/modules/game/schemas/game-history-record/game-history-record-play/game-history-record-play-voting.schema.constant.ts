import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import type { GameHistoryRecordPlayVoting } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting.schema";

const GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS = Object.freeze<Record<keyof GameHistoryRecordPlayVoting, ApiPropertyOptions>>({
  result: {
    required: true,
    enum: GameHistoryRecordVotingResults,
  },
  nominatedPlayers: { required: false },
});

const GAME_HISTORY_RECORD_PLAY_VOTING_API_PROPERTIES = Object.freeze<Record<keyof GameHistoryRecordPlayVoting, ApiPropertyOptions>>({
  result: {
    description: "Define the results and their consequences",
    ...GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS.result,
  },
  nominatedPlayers: {
    description: "Nominated players from the play votes",
    ...GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS.nominatedPlayers,
  },
});

export {
  GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS,
  GAME_HISTORY_RECORD_PLAY_VOTING_API_PROPERTIES,
};