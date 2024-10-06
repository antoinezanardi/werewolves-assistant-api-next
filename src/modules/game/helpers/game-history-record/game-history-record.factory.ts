import { plainToInstance } from "class-transformer";

import { GameHistoryRecordToInsert } from "@/modules/game/types/game-history-record/game-history-record.types";

import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createGameHistoryRecordToInsert(gameHistoryRecordToInsert: GameHistoryRecordToInsert): GameHistoryRecordToInsert {
  return plainToInstance(GameHistoryRecordToInsert, toJSON(gameHistoryRecordToInsert), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createGameHistoryRecordToInsert,
};