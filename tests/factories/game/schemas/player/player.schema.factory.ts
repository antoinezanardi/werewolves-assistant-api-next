import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { gameSourceValues } from "../../../../../src/modules/game/constants/game.constant";
import { PLAYER_DEATH_CAUSES } from "../../../../../src/modules/game/enums/player.enum";
import { PlayerDeath } from "../../../../../src/modules/game/schemas/player/player-death.schema";
import { PlayerRole } from "../../../../../src/modules/game/schemas/player/player-role.schema";
import { PlayerSide } from "../../../../../src/modules/game/schemas/player/player-side.schema";
import { Player } from "../../../../../src/modules/game/schemas/player/player.schema";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../src/modules/role/enums/role.enum";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";
import { createObjectIdFromString } from "../../../../helpers/mongoose/mongoose.helper";
import { bulkCreate } from "../../../shared/bulk-create.factory";

function createFakePlayerDeath(obj: Partial<PlayerDeath> = {}, override: object = {}): PlayerDeath {
  return plainToInstance(PlayerDeath, {
    source: obj.source ?? faker.helpers.arrayElement(Object.values(gameSourceValues)),
    cause: obj.cause ?? faker.helpers.arrayElement(Object.values(PLAYER_DEATH_CAUSES)),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakePlayerSide(obj: Partial<PlayerSide> = {}, override: object = {}): PlayerSide {
  return plainToInstance(PlayerSide, {
    current: obj.current ?? faker.helpers.arrayElement(Object.values(ROLE_SIDES)),
    original: obj.original ?? faker.helpers.arrayElement(Object.values(ROLE_SIDES)),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakePlayerRole(obj: Partial<PlayerRole> = {}, override: object = {}): PlayerRole {
  return plainToInstance(PlayerRole, {
    current: obj.current ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
    original: obj.original ?? faker.helpers.arrayElement(Object.values(ROLE_NAMES)),
    isRevealed: obj.isRevealed ?? faker.datatype.boolean(),
    ...override,
  }, plainToInstanceDefaultOptions);
}

function createFakePlayer(obj: Partial<Player> = {}, override: object = {}): Player {
  return plainToInstance(Player, {
    _id: obj._id ?? createObjectIdFromString(faker.database.mongodbObjectId()),
    name: obj.name ?? faker.helpers.unique(faker.name.firstName),
    role: createFakePlayerRole(obj.role, (override as Player).role),
    side: createFakePlayerSide(obj.side, (override as Player).side),
    attributes: obj.attributes ?? [],
    isAlive: obj.isAlive ?? faker.datatype.boolean(),
    position: obj.position ?? faker.datatype.number({ min: 0 }),
    death: obj.death ? createFakePlayerDeath(obj.death) : undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

function bulkCreateFakePlayers(length: number, players: Partial<Player>[] = [], overrides: object[] = []): Player[] {
  return bulkCreate(length, createFakePlayer, players, overrides);
}

export {
  createFakePlayerDeath,
  createFakePlayerSide,
  createFakePlayerRole,
  createFakePlayer,
  bulkCreateFakePlayers,
};