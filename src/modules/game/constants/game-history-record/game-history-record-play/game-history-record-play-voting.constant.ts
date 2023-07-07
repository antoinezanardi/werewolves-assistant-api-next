import type { ApiPropertyOptions } from "@nestjs/swagger";
import { GAME_HISTORY_RECORD_VOTING_RESULTS } from "../../../enums/game-history-record.enum";
import type { GameHistoryRecordPlayVoting } from "../../../schemas/game-history-record/game-history-record-play/game-history-record-play-voting.schema";

const gameHistoryRecordPlayVotingFieldsSpecs = Object.freeze<Record<keyof GameHistoryRecordPlayVoting, ApiPropertyOptions>>({
  result: {
    required: true,
    enum: GAME_HISTORY_RECORD_VOTING_RESULTS,
  },
  nominatedPlayers: { required: false },
});

const gameHistoryRecordPlayVotingApiProperties = Object.freeze<Record<keyof GameHistoryRecordPlayVoting, ApiPropertyOptions>>({
  result: {
    description: "Define the results and their consequences",
    ...gameHistoryRecordPlayVotingFieldsSpecs.result,
  },
  nominatedPlayers: {
    description: "Nominated players from the play votes",
    ...gameHistoryRecordPlayVotingFieldsSpecs.nominatedPlayers,
  },
});

export {
  gameHistoryRecordPlayVotingFieldsSpecs,
  gameHistoryRecordPlayVotingApiProperties,
};