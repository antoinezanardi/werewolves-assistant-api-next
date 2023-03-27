import { faker } from "@faker-js/faker";
import { gameSourceValues } from "../../../../../src/modules/game/constants/game.constant";
import { GAME_PLAY_ACTIONS } from "../../../../../src/modules/game/enums/game-play.enum";
import type { GamePlay } from "../../../../../src/modules/game/schemas/game-play.schema";

function createFakeGamePlay(obj: Partial<GamePlay> = {}): GamePlay {
  const gamePlay: GamePlay = {
    action: obj.action ?? faker.helpers.arrayElement(Object.values(GAME_PLAY_ACTIONS)),
    source: obj.source ?? faker.helpers.arrayElement(Object.values(gameSourceValues)),
  };
  if (obj.cause) {
    gamePlay.cause = obj.cause;
  }
  return gamePlay;
}

function bulkCreateFakeGamePlays(length: number): GamePlay[] {
  return Array.from(Array(length)).map(() => createFakeGamePlay());
}

export { createFakeGamePlay, bulkCreateFakeGamePlays };