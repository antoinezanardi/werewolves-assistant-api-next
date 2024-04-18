import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_PHASE_NAMES } from "@/modules/game/constants/game-phase/game-phase.constants";
import { GamePhase } from "@/modules/game/schemas/game-phase/game-phase.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeGamePhase(gamePhase: Partial<GamePhase> = {}, override: object = {}): GamePhase {
  return plainToInstance(GamePhase, {
    name: gamePhase.name ?? faker.helpers.arrayElement(GAME_PHASE_NAMES),
    tick: gamePhase.tick ?? faker.number.int({ min: 1 }),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGamePhase };