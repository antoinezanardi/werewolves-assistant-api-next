import { createGamePlayEligibleTargetsBoundaries } from "@/modules/game/helpers/game-play/game-play-eligible-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.factory";
import type { GamePlayEligibleTargetsBoundaries } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema";

import { createFakeGamePlayEligibleTargetsBoundaries } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema.factory";

describe("Game Play Eligible Targets Boundaries Factory", () => {
  describe("createGamePlayEligibleTargetsBoundaries", () => {
    it("should create game play eligible targets boundaries when called.", () => {
      const gamePlayEligibleTargetsBoundaries: GamePlayEligibleTargetsBoundaries = {
        min: 1,
        max: 3,
      };
      const expectedGamePlayEligibleTargetsBoundaries = createFakeGamePlayEligibleTargetsBoundaries(gamePlayEligibleTargetsBoundaries);

      expect(createGamePlayEligibleTargetsBoundaries(gamePlayEligibleTargetsBoundaries)).toStrictEqual<GamePlayEligibleTargetsBoundaries>(expectedGamePlayEligibleTargetsBoundaries);
    });
  });
});