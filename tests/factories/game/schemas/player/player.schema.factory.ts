import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { PlayerRole } from "@/modules/game/schemas/player/player-role.schema";
import { PlayerSide } from "@/modules/game/schemas/player/player-side.schema";
import { Player } from "@/modules/game/schemas/player/player.schema";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { bulkCreate } from "@tests/factories/shared/bulk-create.factory";
import { createFakePlayerDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";

function createFakePlayerSide(playerSide: Partial<PlayerSide> = {}, override: object = {}): PlayerSide {
  return plainToInstance(PlayerSide, {
    current: playerSide.current ?? faker.helpers.arrayElement(Object.values(RoleSides)),
    original: playerSide.original ?? faker.helpers.arrayElement(Object.values(RoleSides)),
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

function createFakePlayerRole(playerRole: Partial<PlayerRole> = {}, override: object = {}): PlayerRole {
  return plainToInstance(PlayerRole, {
    current: playerRole.current ?? faker.helpers.arrayElement(Object.values(RoleNames)),
    original: playerRole.original ?? faker.helpers.arrayElement(Object.values(RoleNames)),
    isRevealed: playerRole.isRevealed ?? faker.datatype.boolean(),
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

function createFakePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return plainToInstance(Player, {
    _id: player._id ?? createFakeObjectId(),
    name: player.name ?? faker.person.firstName(),
    role: createFakePlayerRole(player.role, (override as Player).role),
    side: createFakePlayerSide(player.side, (override as Player).side),
    attributes: player.attributes ?? [],
    isAlive: player.isAlive ?? faker.datatype.boolean(),
    position: player.position ?? faker.number.int({ min: 0 }),
    death: player.death ? createFakePlayerDeath(player.death) : undefined,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

function bulkCreateFakePlayers(length: number, players: Partial<Player>[] = [], overrides: object[] = []): Player[] {
  return bulkCreate(length, createFakePlayer, players, overrides);
}

export {
  createFakePlayerSide,
  createFakePlayerRole,
  createFakePlayer,
  bulkCreateFakePlayers,
};