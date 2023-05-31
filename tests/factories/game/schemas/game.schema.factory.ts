import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { GAME_PHASES, GAME_STATUSES } from "../../../../src/modules/game/enums/game.enum";
import { Game } from "../../../../src/modules/game/schemas/game.schema";
import { plainToInstanceDefaultOptions } from "../../../../src/shared/validation/constants/validation.constant";
import { createObjectIdFromString } from "../../../helpers/mongoose/mongoose.helper";
import { bulkCreate } from "../../shared/bulk-create.factory";
import { createFakeGameOptions } from "./game-options/game-options.schema.factory";

function createFakeGame(game: Partial<Game> = {}, override: object = {}): Game {
  return plainToInstance(Game, {
    _id: game._id ?? createObjectIdFromString(faker.database.mongodbObjectId()),
    players: game.players ?? [],
    upcomingPlays: game.upcomingPlays ?? [],
    phase: game.phase ?? faker.helpers.arrayElement(Object.values(GAME_PHASES)),
    status: game.status ?? faker.helpers.arrayElement(Object.values(GAME_STATUSES)),
    tick: game.tick ?? faker.number.int({ min: 1 }),
    turn: game.turn ?? faker.number.int({ min: 1 }),
    additionalCards: game.additionalCards ?? undefined,
    options: game.options ?? createFakeGameOptions(),
    victory: game.victory ?? undefined,
    createdAt: game.createdAt ?? faker.date.recent(),
    updatedAt: game.updatedAt ?? faker.date.recent(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakeGames(length: number, games: Partial<Game>[] = [], overrides: object[] = []): Game[] {
  return bulkCreate(length, createFakeGame, games, overrides);
}

export { createFakeGame, bulkCreateFakeGames };