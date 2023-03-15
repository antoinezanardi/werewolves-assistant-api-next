import { faker } from "@faker-js/faker";
import type { Player } from "../../../../../src/game/schemas/player/schemas/player.schema";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../src/role/enums/role.enum";

function createFakePlayer(obj: Partial<Player> = {}): Player {
  return {
    _id: obj._id ?? faker.database.mongodbObjectId(),
    name: obj.name ?? faker.name.firstName(),
    role: {
      current: obj.role?.current ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
      original: obj.role?.original ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
      isRevealed: obj.role?.isRevealed ?? faker.datatype.boolean(),
    },
    side: {
      current: obj.side?.current ?? faker.helpers.arrayElement(Object.values(ROLE_SIDES)),
      original: obj.side?.original ?? faker.helpers.arrayElement(Object.values(ROLE_SIDES)),
    },
    attributes: [],
    isAlive: obj.isAlive ?? faker.datatype.boolean(),
    position: obj.position ?? faker.datatype.number({ min: 0 }),
  };
}

function bulkCreateFakePlayers(length: number): Player[] {
  return Array.from(Array(length)).map(() => createFakePlayer());
}

export { createFakePlayer, bulkCreateFakePlayers };