import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { GameHistoryRecordPlayVote } from "../../../schemas/game-history-record/game-history-record-play/game-history-record-play-vote.schema";

const gameHistoryRecordPlayVoteFieldsSpecs = Object.freeze<Record<keyof GameHistoryRecordPlayVote, ApiPropertyOptions>>({
  source: { required: true },
  target: { required: true },
});

const gameHistoryRecordPlayTargetApiProperties = Object.freeze<Record<keyof GameHistoryRecordPlayVote, ApiPropertyOptions>>({
  source: {
    description: "Player who made the vote",
    ...gameHistoryRecordPlayVoteFieldsSpecs.source,
  },
  target: {
    description: "Player targeted by the vote",
    ...gameHistoryRecordPlayVoteFieldsSpecs.target,
  },
});

export { gameHistoryRecordPlayVoteFieldsSpecs, gameHistoryRecordPlayTargetApiProperties };