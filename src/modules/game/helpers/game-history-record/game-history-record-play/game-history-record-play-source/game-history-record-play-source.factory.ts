import { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";
import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";
import { plainToInstance } from "class-transformer";

function createGameHistoryRecordPlaySource(gameHistoryRecordPlaySource: GameHistoryRecordPlaySource): GameHistoryRecordPlaySource {
  return plainToInstance(GameHistoryRecordPlaySource, toJSON(gameHistoryRecordPlaySource), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createGameHistoryRecordPlaySource,
};