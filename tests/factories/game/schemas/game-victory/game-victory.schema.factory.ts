import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_VICTORY_TYPES } from "@/modules/game/enums/game-victory.enum";
import { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

function createFakeGameVictory(gameVictory: Partial<GameVictory> = {}, override: object = {}): GameVictory {
  return plainToInstance(GameVictory, {
    type: gameVictory.type ?? faker.helpers.arrayElement(Object.values(GAME_VICTORY_TYPES)),
    winners: gameVictory.winners ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeGameVictory };