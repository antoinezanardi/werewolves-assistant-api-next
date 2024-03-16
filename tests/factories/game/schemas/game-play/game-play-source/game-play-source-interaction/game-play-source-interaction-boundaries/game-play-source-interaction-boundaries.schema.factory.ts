import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GamePlaySourceInteractionBoundaries } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction-boundaries/game-play-source-interaction-boundaries.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakeGamePlaySourceInteractionBoundaries(
  gamePlayEligibleTargetsBoundaries: Partial<GamePlaySourceInteractionBoundaries> = {},
  override: object = {},
): GamePlaySourceInteractionBoundaries {
  return plainToInstance(GamePlaySourceInteractionBoundaries, {
    min: gamePlayEligibleTargetsBoundaries.min ?? faker.number.int({ min: 1 }),
    max: gamePlayEligibleTargetsBoundaries.max ?? faker.number.int({ min: 1 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGamePlaySourceInteractionBoundaries };