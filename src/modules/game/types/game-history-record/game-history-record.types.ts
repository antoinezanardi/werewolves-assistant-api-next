import { OmitType } from "@nestjs/swagger";
import type { HydratedDocument } from "mongoose";
import type { TupleToUnion } from "type-fest";

import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";
import type { GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_STATUSES, GAME_HISTORY_RECORD_VOTING_RESULTS } from "@/modules/game/constants/game-history-record/game-history-record.constants";

class GameHistoryRecordToInsert extends OmitType(GameHistoryRecord, ["_id", "createdAt"] as const) {}

type GameHistoryRecordDocument = HydratedDocument<GameHistoryRecord>;

type GameHistoryRecordVotingResult = TupleToUnion<typeof GAME_HISTORY_RECORD_VOTING_RESULTS>;

type GameHistoryRecordPlayerAttributeAlterationStatus = TupleToUnion<typeof GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_STATUSES>;

export type {
  GameHistoryRecordDocument,
  GameHistoryRecordVotingResult,
  GameHistoryRecordPlayerAttributeAlterationStatus,
};

export { GameHistoryRecordToInsert };