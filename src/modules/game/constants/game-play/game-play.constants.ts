import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { RoleNames } from "@/modules/role/enums/role.enum";

const GAME_PLAY_TYPES = [
  "no-action",
  "vote",
  "target",
  "choose-card",
  "choose-side",
  "request-another-vote",
  "bury-dead-bodies",
] as const;

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
  RoleNames.ACCURSED_WOLF_FATHER,
] as const satisfies Readonly<(PlayerAttributeNames | PlayerGroups | RoleNames)[]>;

export {
  GAME_PLAY_TYPES,
  GAME_PLAY_SOURCE_NAMES,
};