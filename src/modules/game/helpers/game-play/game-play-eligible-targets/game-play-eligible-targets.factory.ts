import { plainToInstance } from "class-transformer";

import { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createGamePlayEligibleTargets(gamePlayEligibleTargets: GamePlayEligibleTargets): GamePlayEligibleTargets {
  return plainToInstance(GamePlayEligibleTargets, gamePlayEligibleTargets, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createGamePlayEligibleTargets };