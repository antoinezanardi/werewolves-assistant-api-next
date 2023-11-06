import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakeGamePlayEligibleTargets(gamePlayEligibleTargets: Partial<GamePlayEligibleTargets> = {}, override: object = {}): GamePlayEligibleTargets {
  return plainToInstance(GamePlayEligibleTargets, {
    interactablePlayers: gamePlayEligibleTargets.interactablePlayers ?? undefined,
    boundaries: {
      min: gamePlayEligibleTargets.boundaries?.min ?? faker.number.int({ min: 1 }),
      max: gamePlayEligibleTargets.boundaries?.max ?? faker.number.int({ min: 1 }),
    },
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createFakeGamePlayEligibleTargets };