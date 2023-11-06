import { plainToInstance } from "class-transformer";

import { InteractablePlayer } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/interactable-player.schema";

import { toJSON } from "@/shared/misc/helpers/object.helper";
import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

// TODO: test this
function createInteractablePlayer(interactablePlayer: InteractablePlayer): InteractablePlayer {
  return plainToInstance(InteractablePlayer, toJSON(interactablePlayer), PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createInteractablePlayer };