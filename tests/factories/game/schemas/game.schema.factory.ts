import { faker } from "@faker-js/faker";
import { GAME_PHASES, GAME_STATUSES } from "../../../../src/game/enums/game.enum";
import type { Game } from "../../../../src/game/schemas/game.schema";
import { createFakeGameOptions } from "./game-options/game-options.schema.factory";
import { bulkCreateFakePlayers } from "./player/player.schema.factory";

function createFakeGame(obj: Partial<Game> = {}): Game {
  return {
    _id: obj._id ?? faker.database.mongodbObjectId(),
    players: obj.players ?? bulkCreateFakePlayers(4),
    phase: obj.phase ?? faker.helpers.arrayElement(Object.values(GAME_PHASES)),
    status: obj.status ?? faker.helpers.arrayElement(Object.values(GAME_STATUSES)),
    tick: obj.tick ?? faker.datatype.number({ min: 1 }),
    turn: obj.turn ?? faker.datatype.number({ min: 1 }),
    options: obj.options ?? createFakeGameOptions(),
    createdAt: obj.createdAt ?? faker.date.recent(),
    updatedAt: obj.updatedAt ?? faker.date.recent(),
  };
}

function bulkCreateFakeGames(length: number): Game[] {
  return Array.from(Array(length)).map(() => createFakeGame());
}

export { createFakeGame, bulkCreateFakeGames };