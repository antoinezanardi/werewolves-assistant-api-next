import type { ReadonlyDeep } from "type-fest";

import { RoleOrigins, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";
import { createRole } from "@/modules/role/helpers/role.factory";
import type { Role } from "@/modules/role/types/role.class";

const DEFAULT_WEREWOLF_ROLE: ReadonlyDeep<Role> = createRole({
  name: "werewolf",
  side: RoleSides.WEREWOLVES,
  type: RoleTypes.WEREWOLF,
  origin: RoleOrigins.CLASSIC,
  additionalCardsEligibleRecipients: ["thief"],
  maxInGame: 99,
});

const WEREWOLF_ROLES: ReadonlyDeep<Role[]> = [
  DEFAULT_WEREWOLF_ROLE,
  createRole({
    name: "big-bad-wolf",
    side: RoleSides.WEREWOLVES,
    type: RoleTypes.WEREWOLF,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief"],
    recommendedMinPlayers: 15,
  }),
  createRole({
    name: "accursed-wolf-father",
    side: RoleSides.WEREWOLVES,
    type: RoleTypes.WEREWOLF,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief"],
    recommendedMinPlayers: 12,
  }),
  createRole({
    name: "white-werewolf",
    side: RoleSides.WEREWOLVES,
    type: RoleTypes.LONELY,
    origin: RoleOrigins.THE_VILLAGE,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief"],
    recommendedMinPlayers: 12,
  }),
];

const DEFAULT_VILLAGER_ROLE: ReadonlyDeep<Role> = createRole({
  name: "villager",
  side: RoleSides.VILLAGERS,
  type: RoleTypes.VILLAGER,
  origin: RoleOrigins.CLASSIC,
  maxInGame: 99,
  additionalCardsEligibleRecipients: ["thief"],
});

const VILLAGER_ROLES: ReadonlyDeep<Role[]> = [
  DEFAULT_VILLAGER_ROLE,
  createRole({
    name: "villager-villager",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief"],
  }),
  createRole({
    name: "seer",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "cupid",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "witch",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "hunter",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "little-girl",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "defender",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "elder",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "scapegoat",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "idiot",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "two-sisters",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    minInGame: 2,
    maxInGame: 2,
    recommendedMinPlayers: 12,
  }),
  createRole({
    name: "three-brothers",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    minInGame: 3,
    maxInGame: 3,
    recommendedMinPlayers: 15,
  }),
  createRole({
    name: "fox",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    recommendedMinPlayers: 12,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "bear-tamer",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "stuttering-judge",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "rusty-sword-knight",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "thief",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.AMBIGUOUS,
    origin: RoleOrigins.CLASSIC,
    maxInGame: 1,
  }),
  createRole({
    name: "wild-child",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.AMBIGUOUS,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "wolf-hound",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.AMBIGUOUS,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "angel",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.LONELY,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "pied-piper",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.LONELY,
    origin: RoleOrigins.NEW_MOON,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
    recommendedMinPlayers: 12,
  }),
  createRole({
    name: "scandalmonger",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.THE_VILLAGE,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "prejudiced-manipulator",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.LONELY,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief"],
    recommendedMinPlayers: 12,
  }),
  createRole({
    name: "actor",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    maxInGame: 1,
    recommendedMinPlayers: 8,
  }),
  createRole({
    name: "devoted-servant",
    side: RoleSides.VILLAGERS,
    type: RoleTypes.VILLAGER,
    origin: RoleOrigins.CHARACTERS,
    additionalCardsEligibleRecipients: ["thief"],
    maxInGame: 1,
  }),
];

const ROLES: ReadonlyDeep<Role[]> = [
  ...WEREWOLF_ROLES,
  ...VILLAGER_ROLES,
];

const ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES = ROLES.filter(({ additionalCardsEligibleRecipients }) => additionalCardsEligibleRecipients?.includes("thief"));

const ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLES = ROLES.filter(({ additionalCardsEligibleRecipients }) => additionalCardsEligibleRecipients?.includes("actor"));

const ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES = ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES.map(({ name }) => name);

const ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES = ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLES.map(({ name }) => name);

export {
  ROLES,
  WEREWOLF_ROLES,
  VILLAGER_ROLES,
  DEFAULT_WEREWOLF_ROLE,
  DEFAULT_VILLAGER_ROLE,
  ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLES,
  ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLES,
  ELIGIBLE_THIEF_ADDITIONAL_CARDS_ROLE_NAMES,
  ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES,
};