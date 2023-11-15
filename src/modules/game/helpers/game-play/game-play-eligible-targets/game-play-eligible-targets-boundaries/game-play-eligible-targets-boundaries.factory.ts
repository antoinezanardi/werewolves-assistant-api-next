import { plainToInstance } from "class-transformer";

import { GamePlayEligibleTargetsBoundaries } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createGamePlayEligibleTargetsBoundaries(gamePlayEligibleTargetsBoundaries: GamePlayEligibleTargetsBoundaries): GamePlayEligibleTargetsBoundaries {
  return plainToInstance(GamePlayEligibleTargetsBoundaries, toJSON(gamePlayEligibleTargetsBoundaries), PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createGamePlayEligibleTargetsBoundaries };