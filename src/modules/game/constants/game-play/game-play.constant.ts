import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { RoleNames } from "@/modules/role/enums/role.enum";

const GAME_PLAY_SOURCE_NAMES = [
  PlayerAttributeNames.SHERIFF,
  PlayerGroups.CHARMED,
  PlayerGroups.LOVERS,
  PlayerGroups.SURVIVORS,
  PlayerGroups.WEREWOLVES,
  RoleNames.BIG_BAD_WOLF,
  RoleNames.CUPID,
  RoleNames.WOLF_HOUND,
  RoleNames.FOX,
  RoleNames.DEFENDER,
  RoleNames.HUNTER,
  RoleNames.PIED_PIPER,
  RoleNames.SCANDALMONGER,
  RoleNames.SCAPEGOAT,
  RoleNames.SEER,
  RoleNames.STUTTERING_JUDGE,
  RoleNames.THIEF,
  RoleNames.THREE_BROTHERS,
  RoleNames.TWO_SISTERS,
  RoleNames.WHITE_WEREWOLF,
  RoleNames.WILD_CHILD,
  RoleNames.WITCH,
  RoleNames.ACTOR,
  RoleNames.BEAR_TAMER,
] as const satisfies Readonly<(PlayerAttributeNames | PlayerGroups | RoleNames)[]>;

const TARGET_ACTIONS = [
  GamePlayActions.LOOK,
  GamePlayActions.CHARM,
  GamePlayActions.SHOOT,
  GamePlayActions.PROTECT,
  GamePlayActions.CHOOSE_MODEL,
  GamePlayActions.DELEGATE,
  GamePlayActions.SETTLE_VOTES,
  GamePlayActions.EAT,
  GamePlayActions.USE_POTIONS,
  GamePlayActions.MARK,
  GamePlayActions.SNIFF,
  GamePlayActions.BAN_VOTING,
  GamePlayActions.BURY_DEAD_BODIES,
] as const satisfies Readonly<GamePlayActions[]>;

const VOTE_ACTIONS = [
  GamePlayActions.VOTE,
  GamePlayActions.ELECT_SHERIFF,
] as const satisfies Readonly<GamePlayActions[]>;

const STUTTERING_JUDGE_REQUEST_OPPORTUNITY_ACTIONS = [
  GamePlayActions.VOTE,
  GamePlayActions.SETTLE_VOTES,
] as const satisfies Readonly<GamePlayActions[]>;

export {
  GAME_PLAY_SOURCE_NAMES,
  TARGET_ACTIONS,
  VOTE_ACTIONS,
  STUTTERING_JUDGE_REQUEST_OPPORTUNITY_ACTIONS,
};