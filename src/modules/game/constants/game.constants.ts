import type { ReadonlyDeep } from "type-fest";

import { PLAYER_GROUPS } from "@/modules/game/constants/player/player.constants";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { PlayerAttributeName } from "@/modules/game/types/player/player-attribute/player-attribute.types";
import type { PlayerGroup } from "@/modules/game/types/player/player.types";
import { ROLE_NAMES } from "@/modules/role/constants/role.constants";
import type { RoleName } from "@/modules/role/types/role.types";

const GAME_STATUSES = [
  "playing",
  "over",
  "canceled",
] as const;

const GAME_SOURCES = [
  ...PLAYER_GROUPS,
  ...ROLE_NAMES,
  "sheriff",
] as const satisfies Readonly<(PlayerAttributeName | PlayerGroup | RoleName)[]>;

const GAME_PLAYS_PRIORITY_LIST: ReadonlyDeep<GamePlay[]> = [
  {
    type: "bury-dead-bodies",
    source: { name: "survivors" },
    action: "bury-dead-bodies",
    occurrence: "consequential",
  },
  {
    type: "target",
    source: { name: "hunter" },
    action: "shoot",
    occurrence: "consequential",
  },
  {
    type: "vote",
    source: { name: "survivors" },
    action: "elect-sheriff",
    causes: ["previous-votes-were-in-ties"],
    occurrence: "consequential",
  },
  {
    type: "vote",
    source: { name: "survivors" },
    action: "elect-sheriff",
    occurrence: "anytime",
  },
  {
    type: "target",
    source: { name: "sheriff" },
    action: "delegate",
    occurrence: "consequential",
  },
  {
    type: "target",
    source: { name: "scapegoat" },
    action: "ban-voting",
    occurrence: "consequential",
  },
  {
    type: "target",
    source: { name: "sheriff" },
    action: "settle-votes",
    occurrence: "consequential",
  },
  {
    type: "vote",
    source: { name: "survivors" },
    action: "vote",
    causes: ["previous-votes-were-in-ties"],
    occurrence: "consequential",
  },
  {
    type: "vote",
    source: { name: "survivors" },
    action: "vote",
    causes: ["angel-presence"],
    occurrence: "one-night-only",
  },
  {
    type: "vote",
    source: { name: "survivors" },
    action: "vote",
    causes: ["stuttering-judge-request"],
    occurrence: "consequential",
  },
  {
    type: "request-another-vote",
    source: { name: "stuttering-judge" },
    action: "request-another-vote",
    occurrence: "consequential",
  },
  {
    type: "no-action",
    source: { name: "bear-tamer" },
    action: "growl",
    occurrence: "on-days",
  },
  {
    type: "vote",
    source: { name: "survivors" },
    action: "vote",
    occurrence: "on-days",
  },
  {
    type: "choose-card",
    source: { name: "thief" },
    action: "choose-card",
    occurrence: "one-night-only",
  },
  {
    type: "choose-card",
    source: { name: "actor" },
    action: "choose-card",
    occurrence: "on-nights",
  },
  {
    type: "choose-side",
    source: { name: "wolf-hound" },
    action: "choose-side",
    occurrence: "one-night-only",
  },
  {
    type: "target",
    source: { name: "cupid" },
    action: "charm",
    occurrence: "one-night-only",
  },
  {
    type: "target",
    source: { name: "seer" },
    action: "look",
    occurrence: "on-nights",
  },
  {
    type: "target",
    source: { name: "fox" },
    action: "sniff",
    occurrence: "on-nights",
  },
  {
    type: "no-action",
    source: { name: "lovers" },
    action: "meet-each-other",
    occurrence: "one-night-only",
  },
  {
    type: "no-action",
    source: { name: "two-sisters" },
    action: "meet-each-other",
    occurrence: "on-nights",
  },
  {
    type: "no-action",
    source: { name: "three-brothers" },
    action: "meet-each-other",
    occurrence: "on-nights",
  },
  {
    type: "target",
    source: { name: "wild-child" },
    action: "choose-model",
    occurrence: "one-night-only",
  },
  {
    type: "target",
    source: { name: "scandalmonger" },
    action: "mark",
    occurrence: "on-nights",
  },
  {
    type: "target",
    source: { name: "defender" },
    action: "protect",
    occurrence: "on-nights",
  },
  {
    type: "target",
    source: { name: "werewolves" },
    action: "eat",
    occurrence: "on-nights",
  },
  {
    type: "target",
    source: { name: "accursed-wolf-father" },
    action: "infect",
    occurrence: "on-nights",
  },
  {
    type: "target",
    source: { name: "white-werewolf" },
    action: "eat",
    occurrence: "on-nights",
  },
  {
    type: "target",
    source: { name: "big-bad-wolf" },
    action: "eat",
    occurrence: "on-nights",
  },
  {
    type: "target",
    source: { name: "witch" },
    action: "use-potions",
    occurrence: "on-nights",
  },
  {
    type: "target",
    source: { name: "pied-piper" },
    action: "charm",
    occurrence: "on-nights",
  },
  {
    type: "no-action",
    source: { name: "charmed" },
    action: "meet-each-other",
    occurrence: "on-nights",
  },
] as const;

const NIGHT_GAME_PLAYS_PRIORITY_LIST: ReadonlyDeep<GamePlay[]> = GAME_PLAYS_PRIORITY_LIST.filter(({ occurrence }) => ["one-night-only", "on-nights"].includes(occurrence));

const DAY_GAME_PLAYS_PRIORITY_LIST: ReadonlyDeep<GamePlay[]> = GAME_PLAYS_PRIORITY_LIST.filter(({ occurrence }) => occurrence === "on-days");

export {
  GAME_STATUSES,
  GAME_SOURCES,
  GAME_PLAYS_PRIORITY_LIST,
  NIGHT_GAME_PLAYS_PRIORITY_LIST,
  DAY_GAME_PLAYS_PRIORITY_LIST,
};