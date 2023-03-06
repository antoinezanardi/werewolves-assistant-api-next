import { faker } from "@faker-js/faker";
import type { Player } from "../../../../../src/game/schemas/player/player.schema";

function createFakePlayer(obj: Partial<Player> = {}): Player {
  return {
    name: faker.name.firstName(),
    ...obj,
  };
}

function bulkCreateFakePlayers(length: number): Player[] {
  return Array.from(Array(length)).map(() => createFakePlayer());
}

export { createFakePlayer, bulkCreateFakePlayers };