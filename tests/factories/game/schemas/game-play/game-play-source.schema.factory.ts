import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GAME_SOURCES } from "@/modules/game/constants/game.constant";
import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createFakeGamePlaySource(gamePlaySource: Partial<GamePlaySource> = {}, override: object = {}): GamePlaySource {
  return plainToInstance(GamePlaySource, {
    name: gamePlaySource.name ?? faker.helpers.arrayElement(GAME_SOURCES),
    players: gamePlaySource.players ?? undefined,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export { createFakeGamePlaySource };