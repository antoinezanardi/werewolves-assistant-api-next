import { plainToInstance } from "class-transformer";
import type { ReadonlyDeep } from "type-fest";

import { RoleNames, RoleOrigins, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";
import { Role } from "@/modules/role/types/role.types";

const DEFAULT_WEREWOLF_ROLE: ReadonlyDeep<Role> = plainToInstance(Role, {
  name: RoleNames.WEREWOLF,
  side: RoleSides.WEREWOLVES,
  type: RoleTypes.WEREWOLF,
  origin: RoleOrigins.CLASSIC,
  additionalCardsEligibleRecipients: [RoleNames.THIEF],
  maxInGame: 99,
});

const WEREWOLF_ROLES: ReadonlyDeep<Role[]> = plainToInstance(Role, [
  DEFAULT_WEREWOLF_ROLE,
  {
    name: RoleNames.BIG_BAD_WOLF,
    side: RoleSides.WEREWOLVES,
    type: RoleTypes.WEREWOLF,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF],
    recommendedMinPlayers: 15,
  },
  {
    name: RoleNames.ACCURSED_WOLF_FATHER,
    side: RoleSides.WEREWOLVES,
    type: RoleTypes.WEREWOLF,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF],
    recommendedMinPlayers: 12,
  },
  {
    name: RoleNames.WHITE_WEREWOLF,
    side: RoleSides.WEREWOLVES,
    type: RoleTypes.LONELY,
    origin: RoleOrigins.THE_VILLAGE,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF],
    recommendedMinPlayers: 12,
  },
]);

const DEFAULT_VILLAGER_ROLE: ReadonlyDeep<Role> = plainToInstance(Role, {
  name: RoleNames.VILLAGER,
  side: RoleSides.VILLAGERS,
  type: RoleTypes.VILLAGER,
  origin: RoleOrigins.CLASSIC,
  maxInGame: 99,
  additionalCardsEligibleRecipients: [RoleNames.THIEF],
});

const VILLAGER_ROLES: ReadonlyDeep<Role[]> = plainToInstance(Role, [
  DEFAULT_VILLAGER_ROLE,
  {
    name: RoleNames.VILLAGER_VILLAGER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF],
  },
  {
    name: RoleNames.SEER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.CUPID,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.WITCH,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.HUNTER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.LITTLE_GIRL,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.DEFENDER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.ELDER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.SCAPEGOAT,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.IDIOT,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
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
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.BEAR_TAMER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.STUTTERING_JUDGE,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.RUSTY_SWORD_KNIGHT,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
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
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.WOLF_HOUND,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.AMBIGUOUS,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.ANGEL,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.LONELY,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.PIED_PIPER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.LONELY,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
    recommendedMinPlayers: 12,
  },
  {
    name: RoleNames.SCANDALMONGER,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.THE_VILLAGE,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF, RoleNames.ACTOR],
  },
  {
    name: RoleNames.PREJUDICED_MANIPULATOR,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.LONELY,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: [RoleNames.THIEF],
    recommendedMinPlayers: 12,
  },
  {
    name: RoleNames.ACTOR,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    recommendedMinPlayers: 8,
  },
  {
    name: RoleNames.DEVOTED_SERVANT,
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    additionalCardsEligibleRecipients: [RoleNames.THIEF],
    maxInGame: 1,
  },
]);

const ROLES: ReadonlyDeep<Role[]> = plainToInstance(Role, [
  ...WEREWOLF_ROLES,
  ...VILLAGER_ROLES,
]);

const ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES = ROLES.filter(({ additionalCardsEligibleRecipients }) => additionalCardsEligibleRecipients?.includes(RoleNames.THIEF));

const ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES = ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES.map(({ name }) => name);

const ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLES = ROLES.filter(({ additionalCardsEligibleRecipients }) => additionalCardsEligibleRecipients?.includes(RoleNames.ACTOR));

const ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES = ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLES.map(({ name }) => name);

export {
  ROLES,
  DEFAULT_WEREWOLF_ROLE,
  DEFAULT_VILLAGER_ROLE,
  WEREWOLF_ROLES,
  VILLAGER_ROLES,
  ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES,
  ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLES,
  ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES,
  ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES,
};