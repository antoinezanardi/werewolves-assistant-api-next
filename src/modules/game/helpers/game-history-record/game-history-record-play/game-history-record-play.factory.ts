import { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";
import { plainToInstance } from "class-transformer";

function createGameHistoryRecordPlay(gameHistoryRecordPlay: GameHistoryRecordPlay): GameHistoryRecordPlay {
  return plainToInstance(GameHistoryRecordPlay, toJSON(gameHistoryRecordPlay), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createGameHistoryRecordPlay,
};