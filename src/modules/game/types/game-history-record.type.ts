import { OmitType } from "@nestjs/swagger";
import { GameHistoryRecord } from "../schemas/game-history-record/game-history-record.schema";

class GameHistoryRecordToInsert extends OmitType(GameHistoryRecord, ["_id", "createdAt", "updatedAt"] as const) {}

export { GameHistoryRecordToInsert };