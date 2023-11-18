import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_SOURCES } from "@/modules/game/constants/game.constant";
import { PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import { PlayerInteraction } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/player-interaction/player-interaction.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakePlayerInteraction(playerInteraction: Partial<PlayerInteraction> = {}, override: object = {}): PlayerInteraction {
  return plainToInstance(PlayerInteraction, {
    source: playerInteraction.source ?? faker.helpers.arrayElement(GAME_SOURCES),
    type: playerInteraction.type ?? faker.helpers.arrayElement(Object.values(PlayerInteractionTypes)),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakePlayerInteraction };