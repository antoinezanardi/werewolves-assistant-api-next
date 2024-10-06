import { GameFeedback } from "@/modules/game/schemas/game-feedback/game-feedback.schema";
import { GameFeedbackToInsert } from "@/modules/game/types/game-feedback/game-feedback.types";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";
import { faker } from "@faker-js/faker";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { plainToInstance } from "class-transformer";

function createFakeGameFeedbackToInsert(gameFeedbackToInsert: Partial<GameFeedbackToInsert> = {}): GameFeedbackToInsert {
  return plainToInstance(GameFeedbackToInsert, {
    gameId: gameFeedbackToInsert.gameId ?? createFakeObjectId(),
    score: gameFeedbackToInsert.score ?? faker.number.int({ min: 1, max: 5 }),
    review: gameFeedbackToInsert.review,
    hasEncounteredError: gameFeedbackToInsert.hasEncounteredError ?? faker.datatype.boolean(),
    ...gameFeedbackToInsert,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeGameFeedback(gameFeedback: Partial<GameFeedback> = {}): GameFeedback {
  return plainToInstance(GameFeedback, {
    _id: gameFeedback._id ?? createFakeObjectId(),
    gameId: gameFeedback.gameId ?? createFakeObjectId(),
    score: gameFeedback.score ?? faker.number.int({ min: 1, max: 5 }),
    review: gameFeedback.review,
    hasEncounteredError: gameFeedback.hasEncounteredError ?? faker.datatype.boolean(),
    createdAt: gameFeedback.createdAt ?? faker.date.recent(),
    ...gameFeedback,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createFakeGameFeedbackToInsert,
  createFakeGameFeedback,
};