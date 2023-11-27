import { plainToInstance } from "class-transformer";

import { InteractablePlayer } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/interactable-player.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

function createFakeInteractablePlayer(interactablePlayer: Partial<InteractablePlayer> = {}, override: object = {}): InteractablePlayer {
  return plainToInstance(InteractablePlayer, {
    player: interactablePlayer.player ?? createFakePlayer(),
    interactions: interactablePlayer.interactions ?? [],
    ...interactablePlayer,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeInteractablePlayer };