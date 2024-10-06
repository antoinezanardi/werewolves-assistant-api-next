import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_STATUSES } from "@/modules/game/constants/game.constants";
import { Game } from "@/modules/game/schemas/game.schema";
import { GameWithCurrentPlay } from "@/modules/game/types/game-with-current-play.types";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakeGamePhase } from "@tests/factories/game/schemas/game-phase/game-phase.schema.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { createFakeGamePlay } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeGameOptions } from "@tests/factories/game/schemas/game-options/game-options.schema.factory";

function createFakeGame(game: Partial<Game> = {}, override: object = {}): Game {
  return plainToInstance(Game, {
    _id: game._id ?? createFakeObjectId(),
    players: game.players ?? [],
    playerGroups: game.playerGroups,
    currentPlay: game.currentPlay ?? null,
    upcomingPlays: game.upcomingPlays ?? [],
    events: game.events,
    phase: createFakeGamePhase(game.phase),
    status: game.status ?? faker.helpers.arrayElement(GAME_STATUSES),
    tick: game.tick ?? faker.number.int({ min: 1 }),
    turn: game.turn ?? faker.number.int({ min: 1 }),
    additionalCards: game.additionalCards,
    options: createFakeGameOptions(game.options),
    victory: game.victory,
    lastGameHistoryRecord: game.lastGameHistoryRecord ?? null,
    feedback: game.feedback ?? null,
    createdAt: game.createdAt ?? faker.date.recent(),
    updatedAt: game.updatedAt ?? faker.date.recent(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeGameWithCurrentPlay(game: Partial<GameWithCurrentPlay> = {}, override: object = {}): GameWithCurrentPlay {
  return plainToInstance(GameWithCurrentPlay, {
    ...createFakeGame(game, override),
    currentPlay: game.currentPlay ?? createFakeGamePlay(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createFakeGameWithCurrentPlay,
  createFakeGame,
};