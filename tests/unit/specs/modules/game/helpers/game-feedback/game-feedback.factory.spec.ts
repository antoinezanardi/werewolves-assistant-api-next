import { createGameFeedback, createGameFeedbackToInsert } from "@/modules/game/helpers/game-feedback/game-feedback.factory";
import type { GameFeedback } from "@/modules/game/schemas/game-feedback/game-feedback.schema";
import type { GameFeedbackToInsert } from "@/modules/game/types/game-feedback/game-feedback.types";
import { createFakeGameFeedback, createFakeGameFeedbackToInsert } from "@tests/factories/game/schemas/game-feedback/game-feedback.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";

describe("Game Feedback Factory", () => {
  describe("createGameFeedbackToInsert", () => {
    it("should create a game feedback to insert when called.", () => {
      const gameFeedbackToInsert: GameFeedbackToInsert = {
        gameId: createFakeObjectId(),
        score: 5,
        review: "review",
        hasEncounteredError: false,
      };
      const result = createGameFeedbackToInsert(gameFeedbackToInsert);

      expect(result).toStrictEqual<GameFeedbackToInsert>(createFakeGameFeedbackToInsert(gameFeedbackToInsert));
    });
  });

  describe("createGameFeedback", () => {
    it("should create a game feedback when called.", () => {
      const gameFeedback: GameFeedback = {
        _id: createFakeObjectId(),
        gameId: createFakeObjectId(),
        score: 5,
        review: "review",
        hasEncounteredError: false,
        createdAt: new Date(),
      };
      const result = createGameFeedback(gameFeedback);

      expect(result).toStrictEqual<GameFeedback>(createFakeGameFeedback(gameFeedback));
    });
  });
});