import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../../role/enums/role.enum";
import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES } from "../../enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../enums/player.enum";
import type { GamePlay } from "../../schemas/game-play/game-play.schema";
import type { GameSource } from "../../types/game.type";

const gamePlayApiProperties: Readonly<Record<keyof GamePlay, ApiPropertyOptions>> = Object.freeze({
  source: { description: "Which role or group of people need to perform this action, with expected players to play" },
  action: {
    description: "What action need to be performed for this play",
    example: GAME_PLAY_ACTIONS.VOTE,
  },
  cause: { description: "Why this play needs to be performed" },
});

const requiredTargetsActions: Readonly<GAME_PLAY_ACTIONS[]> = Object.freeze([
  GAME_PLAY_ACTIONS.LOOK,
  GAME_PLAY_ACTIONS.CHARM,
  GAME_PLAY_ACTIONS.SHOOT,
  GAME_PLAY_ACTIONS.PROTECT,
  GAME_PLAY_ACTIONS.CHOOSE_MODEL,
  GAME_PLAY_ACTIONS.DELEGATE,
  GAME_PLAY_ACTIONS.SETTLE_VOTES,
]);

const optionalTargetsActions: Readonly<GAME_PLAY_ACTIONS[]> = Object.freeze([
  GAME_PLAY_ACTIONS.EAT,
  GAME_PLAY_ACTIONS.USE_POTIONS,
  GAME_PLAY_ACTIONS.MARK,
  GAME_PLAY_ACTIONS.SNIFF,
  GAME_PLAY_ACTIONS.BAN_VOTING,
]);

const requiredVotesActions: Readonly<GAME_PLAY_ACTIONS[]> = Object.freeze([
  GAME_PLAY_ACTIONS.VOTE,
  GAME_PLAY_ACTIONS.ELECT_SHERIFF,
]);

const stutteringJudgeRequestOpportunityActions: Readonly<GAME_PLAY_ACTIONS[]> = Object.freeze([
  GAME_PLAY_ACTIONS.VOTE,
  GAME_PLAY_ACTIONS.SETTLE_VOTES,
]);

const gamePlaysPriorityList: Readonly<GamePlay[]> = Object.freeze([
  {
    source: { name: ROLE_NAMES.HUNTER },
    action: GAME_PLAY_ACTIONS.SHOOT,
  },
  {
    source: { name: PLAYER_GROUPS.ALL },
    action: GAME_PLAY_ACTIONS.ELECT_SHERIFF,
  },
  {
    source: { name: PLAYER_ATTRIBUTE_NAMES.SHERIFF as GameSource },
    action: GAME_PLAY_ACTIONS.DELEGATE,
  },
  {
    source: { name: ROLE_NAMES.SCAPEGOAT },
    action: GAME_PLAY_ACTIONS.BAN_VOTING,
  },
  {
    source: { name: PLAYER_ATTRIBUTE_NAMES.SHERIFF as GameSource },
    action: GAME_PLAY_ACTIONS.SETTLE_VOTES,
  },
  {
    source: { name: PLAYER_GROUPS.ALL },
    action: GAME_PLAY_ACTIONS.VOTE,
    cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES,
  },
  {
    source: { name: PLAYER_GROUPS.ALL },
    action: GAME_PLAY_ACTIONS.VOTE,
    cause: GAME_PLAY_CAUSES.ANGEL_PRESENCE,
  },
  {
    source: { name: PLAYER_GROUPS.ALL },
    action: GAME_PLAY_ACTIONS.VOTE,
    cause: GAME_PLAY_CAUSES.STUTTERING_JUDGE_REQUEST,
  },
  {
    source: { name: PLAYER_GROUPS.ALL },
    action: GAME_PLAY_ACTIONS.VOTE,
  },
  {
    source: { name: ROLE_NAMES.THIEF },
    action: GAME_PLAY_ACTIONS.CHOOSE_CARD,
  },
  {
    source: { name: ROLE_NAMES.DOG_WOLF },
    action: GAME_PLAY_ACTIONS.CHOOSE_SIDE,
  },
  {
    source: { name: ROLE_NAMES.CUPID },
    action: GAME_PLAY_ACTIONS.CHARM,
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
  },
  {
    source: { name: ROLE_NAMES.STUTTERING_JUDGE },
    action: GAME_PLAY_ACTIONS.CHOOSE_SIGN,
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
  gamePlayApiProperties,
  requiredTargetsActions,
  optionalTargetsActions,
  requiredVotesActions,
  stutteringJudgeRequestOpportunityActions,
  gamePlaysPriorityList,
};