import type { PlayerAttributeName } from "@/modules/game/types/player/player-attribute/player-attribute.types";
import type { PlayerGroup } from "@/modules/game/types/player/player.types";
import type { RoleName } from "@/modules/role/types/role.types";

const GAME_PLAY_TYPES = [
  "no-action",
  "vote",
  "target",
  "choose-card",
  "choose-side",
  "request-another-vote",
  "bury-dead-bodies",
] as const;

const GAME_PLAY_ACTIONS = [
  "eat",
  "look",
  "charm",
  "use-potions",
  "shoot",
  "protect",
  "mark",
  "meet-each-other",
  "sniff",
  "choose-model",
  "choose-side",
  "ban-voting",
  "choose-card",
  "elect-sheriff",
  "vote",
  "delegate",
  "settle-votes",
  "bury-dead-bodies",
  "infect",
  "request-another-vote",
] as const;

const GAME_PLAY_SOURCE_NAMES = [
  "sheriff",
  "charmed",
  "lovers",
  "survivors",
  "werewolves",
  "big-bad-wolf",
  "cupid",
  "wolf-hound",
  "fox",
  "defender",
  "hunter",
  "pied-piper",
  "scandalmonger",
  "scapegoat",
  "seer",
  "stuttering-judge",
  "thief",
  "three-brothers",
  "two-sisters",
  "white-werewolf",
  "wild-child",
  "witch",
  "actor",
  "accursed-wolf-father",
] as const satisfies readonly (PlayerAttributeName | PlayerGroup | RoleName)[];

const GAME_PLAY_CAUSES = [
  "stuttering-judge-request",
  "previous-votes-were-in-ties",
  "angel-presence",
] as const;

const GAME_PLAY_OCCURRENCES = [
  "one-night-only",
  "on-nights",
  "on-days",
  "anytime",
  "consequential",
] as const;

const WITCH_POTIONS = [
  "life",
  "death",
] as const;

export {
  GAME_PLAY_TYPES,
  GAME_PLAY_ACTIONS,
  GAME_PLAY_SOURCE_NAMES,
  GAME_PLAY_CAUSES,
  GAME_PLAY_OCCURRENCES,
  WITCH_POTIONS,
};