import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GameVictoryTypes } from "@/modules/game/enums/game-victory.enum";
import { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeGameVictory(gameVictory: Partial<GameVictory> = {}, override: object = {}): GameVictory {
  return plainToInstance(GameVictory, {
    type: gameVictory.type ?? faker.helpers.arrayElement(Object.values(GameVictoryTypes)),
    winners: gameVictory.winners ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGameVictory };