import { isGamePhaseOver, isInNightOrTwilightPhase } from "@/modules/game/helpers/game-phase/game-phase.helpers";

import { createFakeGamePhase } from "@tests/factories/game/schemas/game-phase/game-phase.schema.factory";
import { createFakeGame, createFakeGameWithCurrentPlay } from "@tests/factories/game/schemas/game.schema.factory";

describe("Game Phase Helper", () => {
  describe("isGamePhaseOver", () => {
    it("should return false when the phase is not over.", () => {
      const game = createFakeGameWithCurrentPlay();

      expect(isGamePhaseOver(game)).toBe(false);
    });

    it("should return true when the phase is over.", () => {
      const game = createFakeGame();

      expect(isGamePhaseOver(game)).toBe(true);
    });
  });

  describe("isInNightOrTwilightPhase", () => {
    it("should return true when the game is in the night phase.", () => {
      const game = createFakeGame({ phase: createFakeGamePhase({ name: "night" }) });

      expect(isInNightOrTwilightPhase(game)).toBe(true);
    });

    it("should return true when the game is in the twilight phase.", () => {
      const game = createFakeGame({ phase: createFakeGamePhase({ name: "twilight" }) });

      expect(isInNightOrTwilightPhase(game)).toBe(true);
    });

    it("should return false when the game is in the day phase.", () => {
      const game = createFakeGame({ phase: createFakeGamePhase({ name: "day" }) });

      expect(isInNightOrTwilightPhase(game)).toBe(false);
    });
  });
});