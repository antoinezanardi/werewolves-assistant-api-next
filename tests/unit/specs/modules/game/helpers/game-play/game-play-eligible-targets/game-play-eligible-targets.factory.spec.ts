import { createGamePlayEligibleTargets } from "@/modules/game/helpers/game-play/game-play-eligible-targets/game-play-eligible-targets.factory";
import type { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";

import { createFakeGamePlayEligibleTargets } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/game-play-eligible-targets.schema.factory";

describe("Game Play Eligible Targets Factory", () => {
  describe("createGamePlayEligibleTargets", () => {
    it("should create game play eligible targets when called.", () => {
      const gamePlayEligibleTargets = {
        boundaries: {
          min: 1,
          max: 1,
        },
      };
      const expectedGamePlayEligibleTargets = createFakeGamePlayEligibleTargets(gamePlayEligibleTargets);

      expect(createGamePlayEligibleTargets(gamePlayEligibleTargets)).toStrictEqual<GamePlayEligibleTargets>(expectedGamePlayEligibleTargets);
    });
  });
});