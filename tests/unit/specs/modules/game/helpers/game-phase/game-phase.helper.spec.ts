import { isGamePhaseOver } from "@/modules/game/helpers/game-phase/game-phase.helper";

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
});