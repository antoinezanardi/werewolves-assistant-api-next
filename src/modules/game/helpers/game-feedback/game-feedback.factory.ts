import { GameFeedback } from "@/modules/game/schemas/game-feedback/game-feedback.schema";
import { GameFeedbackToInsert } from "@/modules/game/types/game-feedback/game-feedback.types";
import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";
import { plainToInstance } from "class-transformer";

function createGameFeedbackToInsert(gameFeedbackToInsert: GameFeedbackToInsert): GameFeedbackToInsert {
  return plainToInstance(GameFeedbackToInsert, toJSON(gameFeedbackToInsert), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createGameFeedback(gameFeedback: GameFeedback): GameFeedback {
  return plainToInstance(GameFeedback, toJSON(gameFeedback), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createGameFeedbackToInsert,
  createGameFeedback,
};