import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { ROLE_NAMES, ROLE_SIDES } from "@/modules/role/constants/role.constants";
import { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import { PlayerRole } from "@/modules/game/schemas/player/player-role/player-role.schema";
import { PlayerSide } from "@/modules/game/schemas/player/player-side/player-side.schema";
import { Player } from "@/modules/game/schemas/player/player.schema";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constants";

import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import { createFakePlayerDeath } from "@tests/factories/game/schemas/player/player-death/player-death.schema.factory";

function createFakePlayerSide(playerSide: Partial<PlayerSide> = {}, override: object = {}): PlayerSide {
  return plainToInstance(PlayerSide, {
    current: playerSide.current ?? faker.helpers.arrayElement(ROLE_SIDES),
    original: playerSide.original ?? faker.helpers.arrayElement(ROLE_SIDES),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakePlayerRole(playerRole: Partial<PlayerRole> = {}, override: object = {}): PlayerRole {
  return plainToInstance(PlayerRole, {
    current: playerRole.current ?? faker.helpers.arrayElement(ROLE_NAMES),
    original: playerRole.original ?? faker.helpers.arrayElement(ROLE_NAMES),
    isRevealed: playerRole.isRevealed ?? faker.datatype.boolean(),
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakeDeadPlayer(deadPlayer: Partial<DeadPlayer> = {}, override: object = {}): DeadPlayer {
  return plainToInstance(DeadPlayer, {
    ...createFakePlayer(deadPlayer),
    death: createFakePlayerDeath(deadPlayer.death),
    isAlive: false,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

function createFakePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return plainToInstance(Player, {
    _id: player._id ?? createFakeObjectId(),
    name: player.name ?? faker.person.firstName(),
    role: createFakePlayerRole(player.role, (override as Player).role),
    side: createFakePlayerSide(player.side, (override as Player).side),
    attributes: player.attributes ?? [],
    isAlive: player.isAlive ?? faker.datatype.boolean(),
    group: player.group ?? undefined,
    position: player.position ?? faker.number.int({ min: 0 }),
    death: player.death ? createFakePlayerDeath(player.death) : undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createFakePlayerSide,
  createFakePlayerRole,
  createFakeDeadPlayer,
  createFakePlayer,
};