import { plainToInstance } from "class-transformer";

import { GamePlayEligibleTargetsBoundaries } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createGamePlayEligibleTargetsBoundaries(gamePlayEligibleTargetsBoundaries: GamePlayEligibleTargetsBoundaries): GamePlayEligibleTargetsBoundaries {
  return plainToInstance(GamePlayEligibleTargetsBoundaries, toJSON(gamePlayEligibleTargetsBoundaries), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createGamePlayEligibleTargetsBoundaries };