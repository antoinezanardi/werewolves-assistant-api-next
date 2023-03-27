import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameSourceValues } from "../../../../../src/modules/game/constants/game.constant";
import { PLAYER_ATTRIBUTE_NAMES } from "../../../../../src/modules/game/enums/player.enum";
import { PlayerAttribute } from "../../../../../src/modules/game/schemas/player/player-attribute/player-attribute.schema";
import { PlayerRole } from "../../../../../src/modules/game/schemas/player/player-role.schema";
import { PlayerSide } from "../../../../../src/modules/game/schemas/player/player-side.schema";
import { Player } from "../../../../../src/modules/game/schemas/player/player.schema";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../src/modules/role/enums/role.enum";

function createFakePlayerAttribute(obj: Partial<PlayerAttribute> = {}): PlayerAttribute {
  return plainToInstance(PlayerAttribute, {
    name: obj.name ?? faker.helpers.arrayElement(Object.values(PLAYER_ATTRIBUTE_NAMES)),
    source: obj.source ?? faker.helpers.arrayElement(gameSourceValues),
  });
}

function bulkCreateFakePlayerAttributes(length: number, attributes: Partial<PlayerAttribute>[] = []): PlayerAttribute[] {
  return plainToInstance(PlayerAttribute, Array.from(Array(length)).map((item, index) => {
    const override = index < attributes.length ? attributes[index] : {};
    return createFakePlayerAttribute(override);
  }));
}

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
    _id: obj._id ?? faker.database.mongodbObjectId(),
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
  createFakePlayerAttribute,
  bulkCreateFakePlayerAttributes,
  createFakePlayerSide,
  createFakePlayerRole,
  createFakePlayer,
  bulkCreateFakePlayers,
};