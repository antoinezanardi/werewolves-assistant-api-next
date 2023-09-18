import { plainToInstance } from "class-transformer";

import { RoleNames, RoleOrigins, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";
import { Role } from "@/modules/role/types/role.type";

const DEFAULT_WEREWOLF_ROLE: Readonly<Role> = Object.freeze(plainToInstance(Role, {
  name: RoleNames.WEREWOLF,
  side: RoleSides.WEREWOLVES,
  type: RoleTypes.WEREWOLF,
  origin: RoleOrigins.CLASSIC,
  maxInGame: 99,
}));

const WEREWOLF_ROLES: Readonly<Role[]> = plainToInstance(Role, [
  DEFAULT_WEREWOLF_ROLE,
  {
    name: RoleNames.BIG_BAD_WOLF,
    side: RoleSides.WEREWOLVES,
    type: RoleTypes.WEREWOLF,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    recommendedMinPlayers: 15,
  },
  {
    name: RoleNames.VILE_FATHER_OF_WOLVES,
    side: RoleSides.WEREWOLVES,
    type: RoleTypes.WEREWOLF,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    recommendedMinPlayers: 12,
  },
  {
    name: RoleNames.WHITE_WEREWOLF,
    side: RoleSides.WEREWOLVES,
    type: RoleTypes.LONELY,
    origin: RoleOrigins.THE_VILLAGE,
    maxInGame: 1,
    recommendedMinPlayers: 12,
  },
]).map(role => Object.freeze(role));

const DEFAULT_VILLAGER_ROLE: Readonly<Role> = Object.freeze(plainToInstance(Role, {
  name: RoleNames.VILLAGER,
  side: RoleSides.VILLAGERS,
  type: RoleTypes.VILLAGER,
  origin: RoleOrigins.CLASSIC,
  maxInGame: 99,
}));

const VILLAGER_ROLES: Readonly<Role[]> = plainToInstance(Role, [
  DEFAULT_VILLAGER_ROLE,
  {
    name: RoleNames.VILLAGER_VILLAGER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
  },
  {
    name: RoleNames.SEER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
  },
  {
    name: RoleNames.CUPID,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
  },
  {
    name: RoleNames.WITCH,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
  },
  {
    name: RoleNames.HUNTER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
  },
  {
    name: RoleNames.LITTLE_GIRL,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
  },
  {
    name: RoleNames.GUARD,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
  },
  {
    name: RoleNames.ANCIENT,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
  },
  {
    name: RoleNames.SCAPEGOAT,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
  },
  {
    name: RoleNames.IDIOT,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
  },
  {
    name: RoleNames.TWO_SISTERS,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    minInGame: 2,
    maxInGame: 2,
    recommendedMinPlayers: 12,
  },
  {
    name: RoleNames.THREE_BROTHERS,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    minInGame: 3,
    maxInGame: 3,
    recommendedMinPlayers: 15,
  },
  {
    name: RoleNames.FOX,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    recommendedMinPlayers: 12,
  },
  {
    name: RoleNames.BEAR_TAMER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
  },
  {
    name: RoleNames.STUTTERING_JUDGE,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
  },
  {
    name: RoleNames.RUSTY_SWORD_KNIGHT,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
  },
  {
    name: RoleNames.THIEF,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.AMBIGUOUS,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
  },
  {
    name: RoleNames.WILD_CHILD,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.AMBIGUOUS,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
  },
  {
    name: RoleNames.DOG_WOLF,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.AMBIGUOUS,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
  },
  {
    name: RoleNames.ANGEL,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.LONELY,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
  },
  {
    name: RoleNames.PIED_PIPER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.LONELY,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
    recommendedMinPlayers: 12,
  },
  {
    name: RoleNames.RAVEN,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.THE_VILLAGE,
    maxInGame: 1,
  },
]).map(role => Object.freeze(role));

const ROLES: Readonly<Role[]> = plainToInstance(Role, [
  ...WEREWOLF_ROLES,
  ...VILLAGER_ROLES,
]).map(role => Object.freeze(role));

export {
  ROLES,
  DEFAULT_WEREWOLF_ROLE,
  DEFAULT_VILLAGER_ROLE,
  WEREWOLF_ROLES,
  VILLAGER_ROLES,
};