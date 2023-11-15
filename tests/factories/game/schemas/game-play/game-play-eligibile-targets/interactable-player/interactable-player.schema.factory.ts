import { plainToInstance } from "class-transformer";

import { InteractablePlayer } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/interactable-player.schema";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

function createFakeInteractablePlayer(interactablePlayer: Partial<InteractablePlayer> = {}, override: object = {}): InteractablePlayer {
  return plainToInstance(InteractablePlayer, {
    player: interactablePlayer.player ?? createFakePlayer(),
    interactions: interactablePlayer.interactions ?? [],
    ...interactablePlayer,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createFakeInteractablePlayer };