import type { PlayerRole } from "@/modules/game/schemas/player/player-role.schema";
import type { PlayerSide } from "@/modules/game/schemas/player/player-side.schema";
import type { Player } from "@/modules/game/schemas/player/player.schema";
import { villagerRoles } from "@/modules/role/constants/role.constant";
import { ROLE_NAMES, ROLE_SIDES } from "@/modules/role/enums/role.enum";

import { createFakePlayer } from "@tests/factories/game/schemas/player/player.schema.factory";

function createFakeWerewolfAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.WEREWOLF, player, override);
}

function createFakeBigBadWolfAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.BIG_BAD_WOLF, player, override);
}

function createFakeVileFatherOfWolvesAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.VILE_FATHER_OF_WOLVES, player, override);
}

function createFakeWhiteWerewolfAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.WHITE_WEREWOLF, player, override);
}

function createFakeVillagerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.VILLAGER, player, override);
}

function createFakeVillagerVillagerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.VILLAGER_VILLAGER, player, override);
}

function createFakeSeerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.SEER, player, override);
}

function createFakeCupidAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.CUPID, player, override);
}

function createFakeWitchAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.WITCH, player, override);
}

function createFakeHunterAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.HUNTER, player, override);
}

function createFakeLittleGirlAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.LITTLE_GIRL, player, override);
}

function createFakeGuardAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.GUARD, player, override);
}

function createFakeAncientAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.ANCIENT, player, override);
}

function createFakeScapegoatAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.SCAPEGOAT, player, override);
}

function createFakeIdiotAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.IDIOT, player, override);
}

function createFakeTwoSistersAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.TWO_SISTERS, player, override);
}

function createFakeThreeBrothersAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.THREE_BROTHERS, player, override);
}

function createFakeFoxAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.FOX, player, override);
}

function createFakeBearTamerAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.BEAR_TAMER, player, override);
}

function createFakeStutteringJudgeAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.STUTTERING_JUDGE, player, override);
}

function createFakeRustySwordKnightAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.RUSTY_SWORD_KNIGHT, player, override);
}

function createFakeWildChildAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.WILD_CHILD, player, override);
}

function createFakeDogWolfAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.DOG_WOLF, player, override);
}

function createFakeThiefAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.THIEF, player, override);
}

function createFakeAngelAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.ANGEL, player, override);
}

function createFakePiedPiperAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.PIED_PIPER, player, override);
}

function createFakeRavenAlivePlayer(player: Partial<Player> = {}, override: object = {}): Player {
  return createFakeAlivePlayerWithRole(ROLE_NAMES.RAVEN, player, override);
}

function createFakeAlivePlayerWithRole(role: ROLE_NAMES, player: Partial<Player> = {}, override: object = {}): Player {
  const playerRole: PlayerRole = {
    current: role,
    original: role,
    isRevealed: role === ROLE_NAMES.VILLAGER_VILLAGER,
  };
  const playerSide: PlayerSide = {
    current: villagerRoles.find(({ name }) => name === role) ? ROLE_SIDES.VILLAGERS : ROLE_SIDES.WEREWOLVES,
    original: villagerRoles.find(({ name }) => name === role) ? ROLE_SIDES.VILLAGERS : ROLE_SIDES.WEREWOLVES,
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
  createFakeGuardAlivePlayer,
  createFakeAncientAlivePlayer,
  createFakeScapegoatAlivePlayer,
  createFakeIdiotAlivePlayer,
  createFakeTwoSistersAlivePlayer,
  createFakeThreeBrothersAlivePlayer,
  createFakeFoxAlivePlayer,
  createFakeBearTamerAlivePlayer,
  createFakeStutteringJudgeAlivePlayer,
  createFakeRustySwordKnightAlivePlayer,
  createFakeWildChildAlivePlayer,
  createFakeDogWolfAlivePlayer,
  createFakeThiefAlivePlayer,
  createFakeAngelAlivePlayer,
  createFakePiedPiperAlivePlayer,
  createFakeRavenAlivePlayer,
};