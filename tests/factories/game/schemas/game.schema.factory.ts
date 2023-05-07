import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { GAME_PHASES, GAME_STATUSES } from "../../../../src/modules/game/enums/game.enum";
import { Game } from "../../../../src/modules/game/schemas/game.schema";
import { plainToInstanceDefaultOptions } from "../../../../src/shared/validation/constants/validation.constant";
import { createObjectIdFromString } from "../../../helpers/mongoose/mongoose.helper";
import { bulkCreate } from "../../shared/bulk-create.factory";
import { createFakeGameOptions } from "./game-options/game-options.schema.factory";

function createFakeGame(obj: Partial<Game> = {}, override: object = {}): Game {
  return plainToInstance(Game, {
    _id: obj._id ?? createObjectIdFromString(faker.database.mongodbObjectId()),
    players: obj.players ?? [],
    upcomingPlays: obj.upcomingPlays ?? [],
    phase: obj.phase ?? faker.helpers.arrayElement(Object.values(GAME_PHASES)),
    status: obj.status ?? faker.helpers.arrayElement(Object.values(GAME_STATUSES)),
    tick: obj.tick ?? faker.datatype.number({ min: 1 }),
    turn: obj.turn ?? faker.datatype.number({ min: 1 }),
    additionalCards: obj.additionalCards ?? undefined,
    options: obj.options ?? createFakeGameOptions(),
    createdAt: obj.createdAt ?? faker.date.recent(),
    updatedAt: obj.updatedAt ?? faker.date.recent(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakeGames(length: number, games: Partial<Game>[] = [], overrides: object[] = []): Game[] {
  return bulkCreate(length, createFakeGame, games, overrides);
}

export { createFakeGame, bulkCreateFakeGames };