import { plainToInstance } from "class-transformer";
import { ROLE_NAMES, ROLE_SIDES, ROLE_TYPES } from "../enums/role.enum";
import { Role } from "../types/role.type";

const defaultWerewolfRole: Readonly<Role> = Object.freeze(plainToInstance(Role, {
  name: ROLE_NAMES.WEREWOLF,
  side: ROLE_SIDES.WEREWOLVES,
  type: ROLE_TYPES.WEREWOLF,
  maxInGame: 99,
}));

const werewolvesRoles: Readonly<Role[]> = plainToInstance(Role, [
  defaultWerewolfRole,
  {
    name: ROLE_NAMES.BIG_BAD_WOLF,
    side: ROLE_SIDES.WEREWOLVES,
    type: ROLE_TYPES.WEREWOLF,
    maxInGame: 1,
    recommendedMinPlayers: 15,
  },
  {
    name: ROLE_NAMES.VILE_FATHER_OF_WOLVES,
    side: ROLE_SIDES.WEREWOLVES,
    type: ROLE_TYPES.WEREWOLF,
    maxInGame: 1,
    recommendedMinPlayers: 12,
  },
  {
    name: ROLE_NAMES.WHITE_WEREWOLF,
    side: ROLE_SIDES.WEREWOLVES,
    type: ROLE_TYPES.LONELY,
    maxInGame: 1,
    recommendedMinPlayers: 12,
  },
]).map(role => Object.freeze(role));

const defaultVillagerRole: Readonly<Role> = Object.freeze(plainToInstance(Role, {
  name: ROLE_NAMES.VILLAGER,
  side: ROLE_SIDES.VILLAGERS,
  type: ROLE_TYPES.VILLAGER,
  maxInGame: 99,
}));

const villagerRoles: Readonly<Role[]> = plainToInstance(Role, [
  defaultVillagerRole,
  {
    name: ROLE_NAMES.VILLAGER_VILLAGER,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.SEER,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.CUPID,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.WITCH,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.HUNTER,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.LITTLE_GIRL,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.GUARD,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.ANCIENT,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.SCAPEGOAT,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.IDIOT,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.TWO_SISTERS,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    minInGame: 2,
    maxInGame: 2,
    recommendedMinPlayers: 12,
  },
  {
    name: ROLE_NAMES.THREE_BROTHERS,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    minInGame: 3,
    maxInGame: 3,
    recommendedMinPlayers: 15,
  },
  {
    name: ROLE_NAMES.FOX,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
    recommendedMinPlayers: 12,
  },
  {
    name: ROLE_NAMES.BEAR_TAMER,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.STUTTERING_JUDGE,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.RUSTY_SWORD_KNIGHT,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.VILLAGER,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.THIEF,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.AMBIGUOUS,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.WILD_CHILD,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.AMBIGUOUS,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.DOG_WOLF,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.AMBIGUOUS,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.ANGEL,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.LONELY,
    maxInGame: 1,
  },
  {
    name: ROLE_NAMES.PIED_PIPER,
    side: ROLE_SIDES.VILLAGERS,
    type: ROLE_TYPES.LONELY,
    maxInGame: 1,
    recommendedMinPlayers: 12,
  },
  {
    name: ROLE_NAMES.RAVEN,
    side: ROLE_SIDES.VILLAGERS,
    maxInGame: 1,
    type: ROLE_TYPES.VILLAGER,
  },
]).map(role => Object.freeze(role));

const roles: Readonly<Role[]> = plainToInstance(Role, [
  ...werewolvesRoles,
  ...villagerRoles,
]).map(role => Object.freeze(role));

export { roles, defaultWerewolfRole, werewolvesRoles, defaultVillagerRole, villagerRoles };