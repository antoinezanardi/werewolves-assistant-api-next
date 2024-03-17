import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_SOURCES } from "@/modules/game/constants/game.constants";
import { PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import { GamePlaySourceInteraction } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakeGamePlaySourceInteractionBoundaries } from "@tests/factories/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction-boundaries/game-play-source-interaction-boundaries.schema.factory";

function createFakeGamePlaySourceInteraction(gamePlaySourceInteraction: Partial<GamePlaySourceInteraction> = {}, override: object = {}): GamePlaySourceInteraction {
  return plainToInstance(GamePlaySourceInteraction, {
    source: gamePlaySourceInteraction.source ?? faker.helpers.arrayElement(Object.values(GAME_SOURCES)),
    type: gamePlaySourceInteraction.type ?? faker.helpers.arrayElement(Object.values(PlayerInteractionTypes)),
    eligibleTargets: gamePlaySourceInteraction.eligibleTargets ?? [],
    boundaries: createFakeGamePlaySourceInteractionBoundaries(gamePlaySourceInteraction.boundaries),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGamePlaySourceInteraction };