import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_SOURCES } from "@/modules/game/constants/game.constants";
import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

function createFakeGamePlaySource(gamePlaySource: Partial<GamePlaySource> = {}, override: object = {}): GamePlaySource {
  return plainToInstance(GamePlaySource, {
    name: gamePlaySource.name ?? faker.helpers.arrayElement(GAME_SOURCES),
    players: gamePlaySource.players ?? undefined,
    interactions: gamePlaySource.interactions ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export { createFakeGamePlaySource };