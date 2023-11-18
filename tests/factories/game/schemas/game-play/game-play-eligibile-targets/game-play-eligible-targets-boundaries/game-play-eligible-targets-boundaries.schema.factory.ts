import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GamePlayEligibleTargetsBoundaries } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakeGamePlayEligibleTargetsBoundaries(
  gamePlayEligibleTargetsBoundaries: Partial<GamePlayEligibleTargetsBoundaries> = {},
  override: object = {},
): GamePlayEligibleTargetsBoundaries {
  return plainToInstance(GamePlayEligibleTargetsBoundaries, {
    min: gamePlayEligibleTargetsBoundaries.min ?? faker.number.int({ min: 1 }),
    max: gamePlayEligibleTargetsBoundaries.max ?? faker.number.int({ min: 1 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGamePlayEligibleTargetsBoundaries };