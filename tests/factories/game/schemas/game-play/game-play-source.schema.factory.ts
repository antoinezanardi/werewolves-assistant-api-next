import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameSourceValues } from "../../../../../src/modules/game/constants/game.constant";
import { GamePlaySource } from "../../../../../src/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";

function createFakeGamePlaySource(gamePlaySource: Partial<GamePlaySource> = {}, override: object = {}): GamePlaySource {
  return plainToInstance(GamePlaySource, {
    name: gamePlaySource.name ?? faker.helpers.arrayElement(gameSourceValues),
    players: gamePlaySource.players ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

export { createFakeGamePlaySource };