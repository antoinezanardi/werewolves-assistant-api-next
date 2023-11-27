import { plainToInstance } from "class-transformer";

import { InteractablePlayer } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/interactable-player.schema";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createInteractablePlayer(interactablePlayer: InteractablePlayer): InteractablePlayer {
  return plainToInstance(InteractablePlayer, toJSON(interactablePlayer), DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createInteractablePlayer };