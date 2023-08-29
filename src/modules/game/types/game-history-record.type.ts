import { OmitType } from "@nestjs/swagger";
import type { HydratedDocument } from "mongoose";

import { GameHistoryRecord } from "@/modules/game/schemas/game-history-record/game-history-record.schema";

class GameHistoryRecordToInsert extends OmitType(GameHistoryRecord, ["_id", "createdAt"] as const) {}

type GameHistoryRecordDocument = HydratedDocument<GameHistoryRecord>;

export type { GameHistoryRecordDocument };

export { GameHistoryRecordToInsert };