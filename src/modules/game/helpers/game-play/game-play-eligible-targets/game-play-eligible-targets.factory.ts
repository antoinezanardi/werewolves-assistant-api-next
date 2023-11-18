import { plainToInstance } from "class-transformer";

import { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createGamePlayEligibleTargets(gamePlayEligibleTargets: GamePlayEligibleTargets): GamePlayEligibleTargets {
  return plainToInstance(GamePlayEligibleTargets, toJSON(gamePlayEligibleTargets), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createGamePlayEligibleTargets };