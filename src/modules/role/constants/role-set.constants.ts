import type { ReadonlyDeep } from "type-fest";

import { createRole } from "@/modules/role/helpers/role.factory";
import type { Role } from "@/modules/role/types/role.class";

const DEFAULT_WEREWOLF_ROLE: ReadonlyDeep<Role> = createRole({
  name: "werewolf",
  side: "werewolves",
  type: "werewolf",
  origin: "classic",
  additionalCardsEligibleRecipients: ["thief"],
  maxInGame: 99,
});

const WEREWOLF_ROLES: ReadonlyDeep<Role[]> = [
  DEFAULT_WEREWOLF_ROLE,
  createRole({
    name: "big-bad-wolf",
    side: "werewolves",
    type: "werewolf",
    origin: "characters",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief"],
    recommendedMinPlayers: 15,
  }),
  createRole({
    name: "accursed-wolf-father",
    side: "werewolves",
    type: "werewolf",
    origin: "characters",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief"],
    recommendedMinPlayers: 12,
  }),
  createRole({
    name: "white-werewolf",
    side: "werewolves",
    type: "lonely",
    origin: "the-village",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief"],
    recommendedMinPlayers: 12,
  }),
];

const DEFAULT_VILLAGER_ROLE: ReadonlyDeep<Role> = createRole({
  name: "villager",
  side: "villagers",
  type: "villager",
  origin: "classic",
  maxInGame: 99,
  additionalCardsEligibleRecipients: ["thief"],
});

const VILLAGER_ROLES: ReadonlyDeep<Role[]> = [
  DEFAULT_VILLAGER_ROLE,
  createRole({
    name: "villager-villager",
    side: "villagers",
    type: "villager",
    origin: "characters",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief"],
  }),
  createRole({
    name: "seer",
    side: "villagers",
    type: "villager",
    origin: "classic",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "cupid",
    side: "villagers",
    type: "villager",
    origin: "classic",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "witch",
    side: "villagers",
    type: "villager",
    origin: "classic",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "hunter",
    side: "villagers",
    type: "villager",
    origin: "classic",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "little-girl",
    side: "villagers",
    type: "villager",
    origin: "classic",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "defender",
    side: "villagers",
    type: "villager",
    origin: "new-moon",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "elder",
    side: "villagers",
    type: "villager",
    origin: "new-moon",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "scapegoat",
    side: "villagers",
    type: "villager",
    origin: "new-moon",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "idiot",
    side: "villagers",
    type: "villager",
    origin: "new-moon",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "two-sisters",
    side: "villagers",
    type: "villager",
    origin: "characters",
    minInGame: 2,
    maxInGame: 2,
    recommendedMinPlayers: 12,
  }),
  createRole({
    name: "three-brothers",
    side: "villagers",
    type: "villager",
    origin: "characters",
    minInGame: 3,
    maxInGame: 3,
    recommendedMinPlayers: 15,
  }),
  createRole({
    name: "fox",
    side: "villagers",
    type: "villager",
    origin: "characters",
    maxInGame: 1,
    recommendedMinPlayers: 12,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "bear-tamer",
    side: "villagers",
    type: "villager",
    origin: "characters",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "stuttering-judge",
    side: "villagers",
    type: "villager",
    origin: "characters",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "rusty-sword-knight",
    side: "villagers",
    type: "villager",
    origin: "characters",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "thief",
    side: "villagers",
    type: "ambiguous",
    origin: "classic",
    maxInGame: 1,
  }),
  createRole({
    name: "wild-child",
    side: "villagers",
    type: "ambiguous",
    origin: "characters",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "wolf-hound",
    side: "villagers",
    type: "ambiguous",
    origin: "characters",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "angel",
    side: "villagers",
    type: "lonely",
    origin: "characters",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "pied-piper",
    side: "villagers",
    type: "lonely",
    origin: "new-moon",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
    recommendedMinPlayers: 12,
  }),
  createRole({
    name: "scandalmonger",
    side: "villagers",
    type: "villager",
    origin: "the-village",
    maxInGame: 1,
    additionalCardsEligibleRecipients: ["thief", "actor"],
  }),
  createRole({
    name: "prejudiced-manipulator",
    side: "villagers",
    type: "lonely",
    origin: "characters",
    maxInGame: 1,
    recommendedMinPlayers: 12,
  }),
  createRole({
    name: "actor",
    side: "villagers",
    type: "villager",
    origin: "characters",
    maxInGame: 1,
    recommendedMinPlayers: 8,
  }),
  createRole({
    name: "devoted-servant",
    side: "villagers",
    type: "villager",
    origin: "characters",
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