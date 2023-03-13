import { faker } from "@faker-js/faker";
import type { Player } from "../../../../../src/game/schemas/player/schemas/player.schema";
import { ROLE_NAMES } from "../../../../../src/role/enums/role.enum";

function createFakePlayer(obj: Partial<Player> = {}): Player {
  return {
    _id: obj._id ?? faker.database.mongodbObjectId(),
    name: obj.name ?? faker.name.firstName(),
    role: obj.role ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
  };
}

function bulkCreateFakePlayers(length: number): Player[] {
  return Array.from(Array(length)).map(() => createFakePlayer());
}

export { createFakePlayer, bulkCreateFakePlayers };