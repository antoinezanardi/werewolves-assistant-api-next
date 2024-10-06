import { plainToInstance } from "class-transformer";

import { GameHistoryRecordPlayerAttributeAlteration } from "@/modules/game/schemas/game-history-record/game-history-record-player-attribute-alteration/game-history-record-player-attribute-alteration.schema";

import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createGameHistoryRecordPlayerAttributeAlteration(playerAttributeAlteration: GameHistoryRecordPlayerAttributeAlteration): GameHistoryRecordPlayerAttributeAlteration {
  return plainToInstance(GameHistoryRecordPlayerAttributeAlteration, toJSON(playerAttributeAlteration), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createGameHistoryRecordPlayerAttributeAlteration,
};