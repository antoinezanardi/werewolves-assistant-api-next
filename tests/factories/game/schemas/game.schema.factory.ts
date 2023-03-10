import { faker } from "@faker-js/faker";
import { GAME_PHASES, GAME_STATUSES } from "../../../../src/game/enums/game.enum";
import type { Game } from "../../../../src/game/schemas/game.schema";
import { bulkCreateFakePlayers } from "./player/player.schema.factory";

function createFakeGame(obj: Partial<Game> = {}): Game {
  return {
    _id: faker.database.mongodbObjectId(),
    players: bulkCreateFakePlayers(4),
    phase: faker.helpers.arrayElement(Object.values(GAME_PHASES)),
    status: faker.helpers.arrayElement(Object.values(GAME_STATUSES)),
    tick: faker.datatype.number({ min: 1 }),
    turn: faker.datatype.number({ min: 1 }),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...obj,
  };
}

function bulkCreateFakeGames(length: number): Game[] {
  return Array.from(Array(length)).map(() => createFakeGame());
}

export { createFakeGame, bulkCreateFakeGames };