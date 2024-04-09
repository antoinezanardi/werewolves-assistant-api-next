import type { PlayerRole } from "@/modules/game/schemas/player/player-role/player-role.schema";
import type { PlayerSide } from "@/modules/game/schemas/player/player-side/player-side.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { VILLAGER_ROLES } from "@/modules/role/constants/role-set.constants";
import { getRoleWithName } from "@/modules/role/helpers/role.helpers";
import type { Role } from "@/modules/role/types/role.class";
import type { RoleName } from "@/modules/role/types/role.types";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

function createFakeWerewolfAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("werewolf", player, override);
}

function createFakeBigBadWolfAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("big-bad-wolf", player, override);
}

function createFakeAccursedWolfFatherAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("accursed-wolf-father", player, override);
}

function createFakeWhiteWerewolfAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("white-werewolf", player, override);
}

function createFakeVillagerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("villager", player, override);
}

function createFakeVillagerVillagerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("villager-villager", player, override);
}

function createFakeSeerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("seer", player, override);
}

function createFakeCupidAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("cupid", player, override);
}

function createFakeWitchAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("witch", player, override);
}

function createFakeHunterAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("hunter", player, override);
}

function createFakeLittleGirlAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("little-girl", player, override);
}

function createFakeDefenderAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("defender", player, override);
}

function createFakeElderAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("elder", player, override);
}

function createFakeScapegoatAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("scapegoat", player, override);
}

function createFakeIdiotAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("idiot", player, override);
}

function createFakeTwoSistersAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("two-sisters", player, override);
}

function createFakeThreeBrothersAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("three-brothers", player, override);
}

function createFakeFoxAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("fox", player, override);
}

function createFakeBearTamerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("bear-tamer", player, override);
}

function createFakeStutteringJudgeAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("stuttering-judge", player, override);
}

function createFakeRustySwordKnightAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("rusty-sword-knight", player, override);
}

function createFakeWildChildAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("wild-child", player, override);
}

function createFakeWolfHoundAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("wolf-hound", player, override);
}

function createFakeThiefAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("thief", player, override);
}

function createFakeAngelAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("angel", player, override);
}

function createFakePiedPiperAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("pied-piper", player, override);
}

function createFakeScandalmongerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("scandalmonger", player, override);
}

function createFakePrejudicedManipulatorAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("prejudiced-manipulator", player, override);
}

function createFakeActorAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("actor", player, override);
}

function createFakeDevotedServantAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole("devoted-servant", player, override);
}

function createFakeAlivePlayerWithRole(role: RoleName, player: Partial<Player> = {}, override: object = {}): Player {
  const playerRole: PlayerRole = {
    current: role,
    original: role,
    isRevealed: role === "villager-villager",
  };
  const villagerRoles = VILLAGER_ROLES as Role[];
  const playerSide: PlayerSide = {
    current: getRoleWithName(villagerRoles, role) ? "villagers" : "werewolves",
    original: getRoleWithName(villagerRoles, role) ? "villagers" : "werewolves",
  };
  return createFakePlayer({
    role: playerRole,
    side: playerSide,
    attributes: [],
    isAlive: true,
    ...player,
  }, override);
}

export {
  createFakeAlivePlayerWithRole,
  createFakeWerewolfAlivePlayer,
  createFakeBigBadWolfAlivePlayer,
  createFakeAccursedWolfFatherAlivePlayer,
  createFakeWhiteWerewolfAlivePlayer,
  createFakeVillagerAlivePlayer,
  createFakeVillagerVillagerAlivePlayer,
  createFakeSeerAlivePlayer,
  createFakeCupidAlivePlayer,
  createFakeWitchAlivePlayer,
  createFakeHunterAlivePlayer,
  createFakeLittleGirlAlivePlayer,
  createFakeDefenderAlivePlayer,
  createFakeElderAlivePlayer,
  createFakeScapegoatAlivePlayer,
  createFakeIdiotAlivePlayer,
  createFakeTwoSistersAlivePlayer,
  createFakeThreeBrothersAlivePlayer,
  createFakeFoxAlivePlayer,
  createFakeBearTamerAlivePlayer,
  createFakeStutteringJudgeAlivePlayer,
  createFakeRustySwordKnightAlivePlayer,
  createFakeWildChildAlivePlayer,
  createFakeWolfHoundAlivePlayer,
  createFakeThiefAlivePlayer,
  createFakeAngelAlivePlayer,
  createFakePiedPiperAlivePlayer,
  createFakeScandalmongerAlivePlayer,
  createFakePrejudicedManipulatorAlivePlayer,
  createFakeActorAlivePlayer,
  createFakeDevotedServantAlivePlayer,
};