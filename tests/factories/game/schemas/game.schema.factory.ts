import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GamePhases, GameStatuses } from "@/modules/game/enums/game.enum";
import { Game } from "@/modules/game/schemas/game.schema";
import { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { createFakeGamePlay } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";

function createFakeGameWithCurrentPlay(game: Partial<GameWithCurrentPlay> = {}, override: object = {}): GameWithCurrentPlay {
  return plainToInstance(GameWithCurrentPlay, {
    ...createFakeGame(game, override),
    currentPlay: game.currentPlay ?? createFakeGamePlay(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeGame(game: Partial<Game> = {}, override: object = {}): Game {
  return plainToInstance(Game, {
    _id: game._id ?? createFakeObjectId(),
    players: game.players ?? [],
    currentPlay: game.currentPlay ?? null,
    upcomingPlays: game.upcomingPlays ?? [],
    phase: game.phase ?? faker.helpers.arrayElement(Object.values(GamePhases)),
    status: game.status ?? faker.helpers.arrayElement(Object.values(GameStatuses)),
    tick: game.tick ?? faker.number.int({ min: 1 }),
    turn: game.turn ?? faker.number.int({ min: 1 }),
    additionalCards: game.additionalCards ?? undefined,
    options: game.options ?? createFakeGameOptions(),
    victory: game.victory ?? undefined,
    createdAt: game.createdAt ?? faker.date.recent(),
    updatedAt: game.updatedAt ?? faker.date.recent(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createFakeGameWithCurrentPlay,
  createFakeGame,
};