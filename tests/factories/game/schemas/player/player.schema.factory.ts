import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { PlayerRole } from "../../../../../src/modules/game/schemas/player/player-role.schema";
import { PlayerSide } from "../../../../../src/modules/game/schemas/player/player-side.schema";
import { Player } from "../../../../../src/modules/game/schemas/player/player.schema";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../src/modules/role/enums/role.enum";
import { createObjectIdFromString } from "../../../../helpers/mongoose/mongoose.helper";
import { bulkCreateFakePlayerAttributes } from "./player-attribute/player-attribute.schema.factory";

function createFakePlayerSide(obj: Partial<PlayerSide> = {}): PlayerSide {
  return plainToInstance(PlayerSide, {
    current: obj.current ?? faker.helpers.arrayElement(Object.values(ROLE_SIDES)),
    original: obj.original ?? faker.helpers.arrayElement(Object.values(ROLE_SIDES)),
  });
}

function createFakePlayerRole(obj: Partial<PlayerRole> = {}): PlayerRole {
  return plainToInstance(PlayerRole, {
    current: obj.current ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
    original: obj.original ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
    isRevealed: obj.isRevealed ?? faker.datatype.boolean(),
  });
}

function createFakePlayer(obj: Partial<Player> = {}): Player {
  return plainToInstance(Player, {
    _id: obj._id ?? createObjectIdFromString(faker.database.mongodbObjectId()),
    name: obj.name ?? faker.helpers.unique(faker.name.firstName),
    role: createFakePlayerRole(obj.role),
    side: createFakePlayerSide(obj.side),
    attributes: obj.attributes ?? bulkCreateFakePlayerAttributes(4),
    isAlive: obj.isAlive ?? faker.datatype.boolean(),
    position: obj.position ?? faker.datatype.number({ min: 0 }),
  });
}

function bulkCreateFakePlayers(length: number, players: Partial<Player>[] = []): Player[] {
  return plainToInstance(Player, Array.from(Array(length)).map((item, index) => {
    const override = index < players.length ? players[index] : {};
    return createFakePlayer(override);
  }));
}

export {
  createFakePlayerSide,
  createFakePlayerRole,
  createFakePlayer,
  bulkCreateFakePlayers,
};