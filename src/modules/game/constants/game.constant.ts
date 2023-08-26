import { ROLE_NAMES } from "../../role/enums/role.enum";
import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES } from "../enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../enums/player.enum";
import type { GamePlay } from "../schemas/game-play/game-play.schema";
import type { GameSource } from "../types/game.type";

const gameSourceValues: Readonly<GameSource[]> = Object.freeze([
  ...Object.values(PLAYER_GROUPS),
  ...Object.values(ROLE_NAMES),
  PLAYER_ATTRIBUTE_NAMES.SHERIFF,
]);

const gamePlaysNightOrder: Readonly<(GamePlay & { isFirstNightOnly?: boolean })[]> = Object.freeze([
  {
    source: { name: PLAYER_GROUPS.ALL },
    action: GAME_PLAY_ACTIONS.VOTE,
    cause: GAME_PLAY_CAUSES.ANGEL_PRESENCE,
    isFirstNightOnly: true,
  },
  {
    source: { name: ROLE_NAMES.THIEF },
    action: GAME_PLAY_ACTIONS.CHOOSE_CARD,
    isFirstNightOnly: true,
  },
  {
    source: { name: ROLE_NAMES.DOG_WOLF },
    action: GAME_PLAY_ACTIONS.CHOOSE_SIDE,
    isFirstNightOnly: true,
  },
  {
    source: { name: ROLE_NAMES.CUPID },
    action: GAME_PLAY_ACTIONS.CHARM,
    isFirstNightOnly: true,
  },
  {
    source: { name: ROLE_NAMES.SEER },
    action: GAME_PLAY_ACTIONS.LOOK,
  },
  {
    source: { name: ROLE_NAMES.FOX },
    action: GAME_PLAY_ACTIONS.SNIFF,
  },
  {
    source: { name: PLAYER_GROUPS.LOVERS },
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    isFirstNightOnly: true,
  },
  {
    source: { name: ROLE_NAMES.STUTTERING_JUDGE },
    action: GAME_PLAY_ACTIONS.CHOOSE_SIGN,
    isFirstNightOnly: true,
  },
  {
    source: { name: ROLE_NAMES.TWO_SISTERS },
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
  },
  {
    source: { name: ROLE_NAMES.THREE_BROTHERS },
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
  },
  {
    source: { name: ROLE_NAMES.WILD_CHILD },
    action: GAME_PLAY_ACTIONS.CHOOSE_MODEL,
    isFirstNightOnly: true,
  },
  {
    source: { name: ROLE_NAMES.RAVEN },
    action: GAME_PLAY_ACTIONS.MARK,
  },
  {
    source: { name: ROLE_NAMES.GUARD },
    action: GAME_PLAY_ACTIONS.PROTECT,
  },
  {
    source: { name: PLAYER_GROUPS.WEREWOLVES },
    action: GAME_PLAY_ACTIONS.EAT,
  },
  {
    source: { name: ROLE_NAMES.WHITE_WEREWOLF },
    action: GAME_PLAY_ACTIONS.EAT,
  },
  {
    source: { name: ROLE_NAMES.BIG_BAD_WOLF },
    action: GAME_PLAY_ACTIONS.EAT,
  },
  {
    source: { name: ROLE_NAMES.WITCH },
    action: GAME_PLAY_ACTIONS.USE_POTIONS,
  },
  {
    source: { name: ROLE_NAMES.PIED_PIPER },
    action: GAME_PLAY_ACTIONS.CHARM,
  },
  {
    source: { name: PLAYER_GROUPS.CHARMED },
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
  },
]);

export {
  gameSourceValues,
  gamePlaysNightOrder,
};