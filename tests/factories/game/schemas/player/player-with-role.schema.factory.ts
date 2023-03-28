import type { PlayerRole } from "../../../../../src/modules/game/schemas/player/player-role.schema";
import type { PlayerSide } from "../../../../../src/modules/game/schemas/player/player-side.schema";
import type { Player } from "../../../../../src/modules/game/schemas/player/player.schema";
import { villagerRoles } from "../../../../../src/modules/role/constants/role.constant";
import { ROLE_NAMES, ROLE_SIDES } from "../../../../../src/modules/role/enums/role.enum";
import { createFakePlayer } from "./player.schema.factory";

function createFakeWerewolfPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.WEREWOLF, obj);
}

function createFakeBigBadWolfPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.BIG_BAD_WOLF, obj);
}

function createFakeVileFatherOfWolvesPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.VILE_FATHER_OF_WOLVES, obj);
}

function createFakeWhiteWerewolfPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.WHITE_WEREWOLF, obj);
}

function createFakeVillagerPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.VILLAGER, obj);
}

function createFakeVillagerVillagerPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.VILLAGER_VILLAGER, obj);
}

function createFakeSeerPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.SEER, obj);
}

function createFakeCupidPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.CUPID, obj);
}

function createFakeWitchPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.WITCH, obj);
}

function createFakeHunterPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.HUNTER, obj);
}

function createFakeLittleGirlPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.LITTLE_GIRL, obj);
}

function createFakeGuardPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.GUARD, obj);
}

function createFakeAncientPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.ANCIENT, obj);
}

function createFakeScapegoatPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.SCAPEGOAT, obj);
}

function createFakeIdiotPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.IDIOT, obj);
}

function createFakeTwoSistersPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.TWO_SISTERS, obj);
}

function createFakeThreeBrothersPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.THREE_BROTHERS, obj);
}

function createFakeFoxPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.FOX, obj);
}

function createFakeBearTamerPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.BEAR_TAMER, obj);
}

function createFakeStutteringJudgePlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.STUTTERING_JUDGE, obj);
}

function createFakeRustySwordKnightPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.RUSTY_SWORD_KNIGHT, obj);
}

function createFakeWildChildPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.WILD_CHILD, obj);
}

function createFakeDogWolfPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.DOG_WOLF, obj);
}

function createFakeThiefPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.THIEF, obj);
}

function createFakeAngelPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.ANGEL, obj);
}

function createFakePiedPiperPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.PIED_PIPER, obj);
}

function createFakeRavenPlayer(obj: Partial<Player> = {}): Player {
  return createFakePlayerWithRole(ROLE_NAMES.RAVEN, obj);
}

function createFakePlayerWithRole(role: ROLE_NAMES, obj: Partial<Player> = {}): Player {
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
    ...obj,
  });
}

export {
  createFakePlayerWithRole,
  createFakeWerewolfPlayer,
  createFakeBigBadWolfPlayer,
  createFakeVileFatherOfWolvesPlayer,
  createFakeWhiteWerewolfPlayer,
  createFakeVillagerPlayer,
  createFakeVillagerVillagerPlayer,
  createFakeSeerPlayer,
  createFakeCupidPlayer,
  createFakeWitchPlayer,
  createFakeHunterPlayer,
  createFakeLittleGirlPlayer,
  createFakeGuardPlayer,
  createFakeAncientPlayer,
  createFakeScapegoatPlayer,
  createFakeIdiotPlayer,
  createFakeTwoSistersPlayer,
  createFakeThreeBrothersPlayer,
  createFakeFoxPlayer,
  createFakeBearTamerPlayer,
  createFakeStutteringJudgePlayer,
  createFakeRustySwordKnightPlayer,
  createFakeWildChildPlayer,
  createFakeDogWolfPlayer,
  createFakeThiefPlayer,
  createFakeAngelPlayer,
  createFakePiedPiperPlayer,
  createFakeRavenPlayer,
};