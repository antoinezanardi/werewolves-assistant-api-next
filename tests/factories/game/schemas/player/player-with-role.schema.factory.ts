import type { PlayerRole } from "@/modules/game/schemas/player/player-role/player-role.schema";
import type { PlayerSide } from "@/modules/game/schemas/player/player-side/player-side.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { VILLAGER_ROLES } from "@/modules/role/constants/role.constant";
import { RoleNames, RoleSides } from "@/modules/role/enums/role.enum";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

function createFakeWerewolfAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.WEREWOLF, player, override);
}

function createFakeBigBadWolfAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.BIG_BAD_WOLF, player, override);
}

function createFakeVileFatherOfWolvesAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.VILE_FATHER_OF_WOLVES, player, override);
}

function createFakeWhiteWerewolfAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.WHITE_WEREWOLF, player, override);
}

function createFakeVillagerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.VILLAGER, player, override);
}

function createFakeVillagerVillagerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.VILLAGER_VILLAGER, player, override);
}

function createFakeSeerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.SEER, player, override);
}

function createFakeCupidAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.CUPID, player, override);
}

function createFakeWitchAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.WITCH, player, override);
}

function createFakeHunterAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.HUNTER, player, override);
}

function createFakeLittleGirlAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.LITTLE_GIRL, player, override);
}

function createFakeDefenderAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.DEFENDER, player, override);
}

function createFakeElderAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.ELDER, player, override);
}

function createFakeScapegoatAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.SCAPEGOAT, player, override);
}

function createFakeIdiotAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.IDIOT, player, override);
}

function createFakeTwoSistersAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.TWO_SISTERS, player, override);
}

function createFakeThreeBrothersAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.THREE_BROTHERS, player, override);
}

function createFakeFoxAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.FOX, player, override);
}

function createFakeBearTamerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.BEAR_TAMER, player, override);
}

function createFakeStutteringJudgeAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.STUTTERING_JUDGE, player, override);
}

function createFakeRustySwordKnightAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.RUSTY_SWORD_KNIGHT, player, override);
}

function createFakeWildChildAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.WILD_CHILD, player, override);
}

function createFakeWolfHoundAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.WOLF_HOUND, player, override);
}

function createFakeThiefAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.THIEF, player, override);
}

function createFakeAngelAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.ANGEL, player, override);
}

function createFakePiedPiperAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.PIED_PIPER, player, override);
}

function createFakeScandalmongerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(RoleNames.SCANDALMONGER, player, override);
}

function createFakeAlivePlayerWithRole(role: RoleNames, player: Partial<Player> = {}, override: object = {}): Player {
  const playerRole: PlayerRole = {
    current: role,
    original: role,
    isRevealed: role === RoleNames.VILLAGER_VILLAGER,
  };
  const playerSide: PlayerSide = {
    current: VILLAGER_ROLES.find(({ name }) => name === role) ? RoleSides.VILLAGERS : RoleSides.WEREWOLVES,
    original: VILLAGER_ROLES.find(({ name }) => name === role) ? RoleSides.VILLAGERS : RoleSides.WEREWOLVES,
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
  createFakeVileFatherOfWolvesAlivePlayer,
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
};