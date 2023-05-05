import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameSourceValues } from "../../../../../src/modules/game/constants/game.constant";
import { GAME_PLAY_ACTIONS } from "../../../../../src/modules/game/enums/game-play.enum";
import { GamePlay } from "../../../../../src/modules/game/schemas/game-play.schema";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";
import { bulkCreate } from "../../../shared/bulk-create.factory";

function createFakeGamePlay(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return plainToInstance(GamePlay, {
    action: gamePlay.action ?? faker.helpers.arrayElement(Object.values(GAME_PLAY_ACTIONS)),
    source: gamePlay.source ?? faker.helpers.arrayElement(Object.values(gameSourceValues)),
    cause: gamePlay.cause ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakeGamePlays(length: number, gamePlays: Partial<GamePlay>[] = [], overrides: object[] = []): GamePlay[] {
  return bulkCreate(length, createFakeGamePlay, gamePlays, overrides);
}

export { createFakeGamePlay, bulkCreateFakeGamePlays };