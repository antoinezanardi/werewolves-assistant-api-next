import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { createFakeGamePlayEligibleTargetsBoundaries } from "@tests/factories/game/schemas/game-play/game-play-eligibile-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema.factory";

function createFakeGamePlayEligibleTargets(gamePlayEligibleTargets: Partial<GamePlayEligibleTargets> = {}, override: object = {}): GamePlayEligibleTargets {
  return plainToInstance(GamePlayEligibleTargets, {
    interactablePlayers: gamePlayEligibleTargets.interactablePlayers ?? undefined,
    boundaries: createFakeGamePlayEligibleTargetsBoundaries(gamePlayEligibleTargets.boundaries),
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createFakeGamePlayEligibleTargets };