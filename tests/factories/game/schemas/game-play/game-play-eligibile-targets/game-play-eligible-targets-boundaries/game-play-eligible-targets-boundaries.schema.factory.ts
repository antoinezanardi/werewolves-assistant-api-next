import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GamePlayEligibleTargetsBoundaries } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakeGamePlayEligibleTargetsBoundaries(
  gamePlayEligibleTargetsBoundaries: Partial<GamePlayEligibleTargetsBoundaries> = {},
  override: object = {},
): GamePlayEligibleTargetsBoundaries {
  return plainToInstance(GamePlayEligibleTargetsBoundaries, {
    min: gamePlayEligibleTargetsBoundaries.min ?? faker.number.int({ min: 1 }),
    max: gamePlayEligibleTargetsBoundaries.max ?? faker.number.int({ min: 1 }),
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createFakeGamePlayEligibleTargetsBoundaries };