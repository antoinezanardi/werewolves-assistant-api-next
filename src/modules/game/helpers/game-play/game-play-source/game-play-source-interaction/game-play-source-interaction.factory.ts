import { plainToInstance } from "class-transformer";

import { GamePlaySourceInteraction } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema";

import { toJSON } from "@/shared/misc/helpers/object.helpers";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createGamePlaySourceInteraction(gamePlayEligibleTargets: GamePlaySourceInteraction): GamePlaySourceInteraction {
  return plainToInstance(GamePlaySourceInteraction, toJSON(gamePlayEligibleTargets), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createGamePlaySourceInteraction };