import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../role/enums/role.enum";
import { GAME_PLAY_ACTIONS } from "../enums/game-play.enum";
import { PLAYER_GROUPS } from "../enums/player.enum";
import type { GamePlay } from "../schemas/game-play.schema";
import { gameSourceValues } from "./game.constant";

const gamePlayApiProperties: Record<keyof GamePlay, ApiPropertyOptions> = Object.freeze({
  source: {
    description: "Which role or group of people need to perform this action",
    enum: gameSourceValues,
  },
  action: {
    description: "What action need to be performed for this play",
    example: GAME_PLAY_ACTIONS.VOTE,
  },
  cause: { description: "Why this play needs to be performed" },
});

const gamePlaysNightOrder: readonly (GamePlay & { isFirstNightOnly?: boolean })[] = Object.freeze([
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

const sheriffElectionPlay: GamePlay = Object.freeze({
  source: PLAYER_GROUPS.ALL,
  action: GAME_PLAY_ACTIONS.ELECT_SHERIFF,
});

export { gamePlayApiProperties, gamePlaysNightOrder, sheriffElectionPlay };