import { GameHistoryRecordPlayVoting } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";
import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";
import { plainToInstance } from "class-transformer";

function createGameHistoryRecordPlayVoting(gameHistoryRecordPlayVoting: GameHistoryRecordPlayVoting): GameHistoryRecordPlayVoting {
  return plainToInstance(GameHistoryRecordPlayVoting, toJSON(gameHistoryRecordPlayVoting), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createGameHistoryRecordPlayVoting,
};