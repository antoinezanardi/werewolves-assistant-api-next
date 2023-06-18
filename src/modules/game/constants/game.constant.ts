import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../role/enums/role.enum";
import { GAME_PLAY_ACTIONS } from "../enums/game-play.enum";
import { GAME_PHASES, GAME_STATUSES } from "../enums/game.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../enums/player.enum";
import type { GamePlay } from "../schemas/game-play.schema";
import type { Game } from "../schemas/game.schema";
import type { GameSource } from "../types/game.type";

const gameFieldsSpecs = Object.freeze({
  players: {
    minItems: 4,
    maxItems: 40,
  },
  turn: { default: 1 },
  phase: { default: GAME_PHASES.NIGHT },
  tick: { default: 1 },
  status: { default: GAME_STATUSES.PLAYING },
});

const gameApiProperties: Readonly<Record<keyof Game, ApiPropertyOptions>> = Object.freeze({
  _id: {
    description: "Game's Mongo ObjectId",
    example: "507f1f77bcf86cd799439011",
  },
  turn: {
    description: "Starting at `1`, a turn starts with the first phase (the `night`) and ends with the second phase (the `day`)",
    ...gameFieldsSpecs.turn,
  },
  phase: {
    description: "Each turn has two phases, `day` and `night`. Starting at `night`",
    ...gameFieldsSpecs.phase,
  },
  tick: {
    description: "Starting at `1`, tick increments each time a play is made",
    ...gameFieldsSpecs.tick,
  },
  status: {
    description: "Game's current status",
    ...gameFieldsSpecs.status,
  },
  players: {
    description: "Players of the game",
    ...gameFieldsSpecs.players,
  },
  currentPlay: { description: "Current play which needs to be performed" },
  upcomingPlays: { description: "Queue of upcoming plays that needs to be performed to continue the game right after the current play" },
  options: { description: "Game's options" },
  additionalCards: { description: "Game's additional cards" },
  victory: { description: "Victory data set when `status` is `over`" },
  createdAt: { description: "When the game was created" },
  updatedAt: { description: "When the game was updated" },
});

const gameSourceValues: Readonly<GameSource[]> = Object.freeze([...Object.values(PLAYER_GROUPS), ...Object.values(ROLE_NAMES), PLAYER_ATTRIBUTE_NAMES.SHERIFF]);

const gamePlaysNightOrder: Readonly<(GamePlay & { isFirstNightOnly?: boolean })[]> = Object.freeze([
  {
    source: PLAYER_GROUPS.ALL,
    action: GAME_PLAY_ACTIONS.VOTE,
    isFirstNightOnly: true,
  },
  {
    source: ROLE_NAMES.THIEF,
    action: GAME_PLAY_ACTIONS.CHOOSE_CARD,
    isFirstNightOnly: true,
  },
  {
    source: ROLE_NAMES.DOG_WOLF,
    action: GAME_PLAY_ACTIONS.CHOOSE_SIDE,
    isFirstNightOnly: true,
  },
  {
    source: ROLE_NAMES.CUPID,
    action: GAME_PLAY_ACTIONS.CHARM,
    isFirstNightOnly: true,
  },
  {
    source: ROLE_NAMES.SEER,
    action: GAME_PLAY_ACTIONS.LOOK,
  },
  {
    source: ROLE_NAMES.FOX,
    action: GAME_PLAY_ACTIONS.SNIFF,
  },
  {
    source: PLAYER_GROUPS.LOVERS,
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    isFirstNightOnly: true,
  },
  {
    source: ROLE_NAMES.STUTTERING_JUDGE,
    action: GAME_PLAY_ACTIONS.CHOOSE_SIGN,
    isFirstNightOnly: true,
  },
  {
    source: ROLE_NAMES.TWO_SISTERS,
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
  },
  {
    source: ROLE_NAMES.THREE_BROTHERS,
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
  },
  {
    source: ROLE_NAMES.WILD_CHILD,
    action: GAME_PLAY_ACTIONS.CHOOSE_MODEL,
    isFirstNightOnly: true,
  },
  {
    source: ROLE_NAMES.RAVEN,
    action: GAME_PLAY_ACTIONS.MARK,
  },
  {
    source: ROLE_NAMES.GUARD,
    action: GAME_PLAY_ACTIONS.PROTECT,
  },
  {
    source: PLAYER_GROUPS.WEREWOLVES,
    action: GAME_PLAY_ACTIONS.EAT,
  },
  {
    source: ROLE_NAMES.WHITE_WEREWOLF,
    action: GAME_PLAY_ACTIONS.EAT,
  },
  {
    source: ROLE_NAMES.BIG_BAD_WOLF,
    action: GAME_PLAY_ACTIONS.EAT,
  },
  {
    source: ROLE_NAMES.WITCH,
    action: GAME_PLAY_ACTIONS.USE_POTIONS,
  },
  {
    source: ROLE_NAMES.PIED_PIPER,
    action: GAME_PLAY_ACTIONS.CHARM,
  },
  {
    source: PLAYER_GROUPS.CHARMED,
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
  },
]);

export {
  gameFieldsSpecs,
  gameApiProperties,
  gameSourceValues,
  gamePlaysNightOrder,
};