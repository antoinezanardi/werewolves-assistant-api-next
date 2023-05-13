import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { GAME_VICTORY_TYPES } from "../../../../../src/modules/game/enums/game-victory.enum";
import { GameVictory } from "../../../../../src/modules/game/schemas/game-victory/game-victory.schema";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";
import { bulkCreate } from "../../../shared/bulk-create.factory";

function createFakeGameVictory(gameVictory: Partial<GameVictory> = {}, override: object = {}): GameVictory {
  return plainToInstance(GameVictory, {
    type: gameVictory.type ?? faker.helpers.arrayElement(Object.values(GAME_VICTORY_TYPES)),
    winners: gameVictory.winners ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakeGameVictories(length: number, gameAdditionalCards: Partial<GameVictory>[] = [], overrides: object[] = []): GameVictory[] {
  return bulkCreate(length, createFakeGameVictory, gameAdditionalCards, overrides);
}

export { bulkCreateFakeGameVictories, createFakeGameVictory };