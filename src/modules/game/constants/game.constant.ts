import type { ReadonlyDeep } from "type-fest";

import { GamePlayActions, GamePlayCauses, GamePlayOccurrences } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

const GAME_SOURCES = [
  ...Object.values(PlayerGroups),
  ...Object.values(RoleNames),
  PlayerAttributeNames.SHERIFF,
] as const satisfies Readonly<(PlayerAttributeNames | PlayerGroups | RoleNames)[]>;

const GAME_PLAYS_PRIORITY_LIST: ReadonlyDeep<GamePlay[]> = [
  {
    source: { name: PlayerGroups.SURVIVORS },
    action: GamePlayActions.BURY_DEAD_BODIES,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
  },
  {
    source: { name: RoleNames.HUNTER },
    action: GamePlayActions.SHOOT,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
  },
  {
    source: { name: PlayerGroups.SURVIVORS },
    action: GamePlayActions.ELECT_SHERIFF,
    cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
  },
  {
    source: { name: PlayerGroups.SURVIVORS },
    action: GamePlayActions.ELECT_SHERIFF,
    occurrence: GamePlayOccurrences.ANYTIME,
  },
  {
    source: { name: PlayerAttributeNames.SHERIFF },
    action: GamePlayActions.DELEGATE,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
  },
  {
    source: { name: RoleNames.SCAPEGOAT },
    action: GamePlayActions.BAN_VOTING,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
  },
  {
    source: { name: PlayerAttributeNames.SHERIFF },
    action: GamePlayActions.SETTLE_VOTES,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
  },
  {
    source: { name: PlayerGroups.SURVIVORS },
    action: GamePlayActions.VOTE,
    cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
  },
  {
    source: { name: PlayerGroups.SURVIVORS },
    action: GamePlayActions.VOTE,
    cause: GamePlayCauses.ANGEL_PRESENCE,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
  },
  {
    source: { name: PlayerGroups.SURVIVORS },
    action: GamePlayActions.VOTE,
    cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
  },
  {
    source: { name: RoleNames.STUTTERING_JUDGE },
    action: GamePlayActions.REQUEST_ANOTHER_VOTE,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
  },
  {
    source: { name: RoleNames.BEAR_TAMER },
    action: GamePlayActions.GROWL,
    occurrence: GamePlayOccurrences.ON_DAYS,
  },
  {
    source: { name: PlayerGroups.SURVIVORS },
    action: GamePlayActions.VOTE,
    occurrence: GamePlayOccurrences.ON_DAYS,
  },
  {
    source: { name: RoleNames.THIEF },
    action: GamePlayActions.CHOOSE_CARD,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
  },
  {
    source: { name: RoleNames.ACTOR },
    action: GamePlayActions.CHOOSE_CARD,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: RoleNames.WOLF_HOUND },
    action: GamePlayActions.CHOOSE_SIDE,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
  },
  {
    source: { name: RoleNames.CUPID },
    action: GamePlayActions.CHARM,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
  },
  {
    source: { name: RoleNames.SEER },
    action: GamePlayActions.LOOK,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: RoleNames.FOX },
    action: GamePlayActions.SNIFF,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: PlayerGroups.LOVERS },
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
  },
  {
    source: { name: RoleNames.TWO_SISTERS },
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: RoleNames.THREE_BROTHERS },
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: RoleNames.WILD_CHILD },
    action: GamePlayActions.CHOOSE_MODEL,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
  },
  {
    source: { name: RoleNames.SCANDALMONGER },
    action: GamePlayActions.MARK,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: RoleNames.DEFENDER },
    action: GamePlayActions.PROTECT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: PlayerGroups.WEREWOLVES },
    action: GamePlayActions.EAT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: RoleNames.ACCURSED_WOLF_FATHER },
    action: GamePlayActions.INFECT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: RoleNames.WHITE_WEREWOLF },
    action: GamePlayActions.EAT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: RoleNames.BIG_BAD_WOLF },
    action: GamePlayActions.EAT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: RoleNames.WITCH },
    action: GamePlayActions.USE_POTIONS,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: RoleNames.PIED_PIPER },
    action: GamePlayActions.CHARM,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
  {
    source: { name: PlayerGroups.CHARMED },
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
  },
] as const;

const NIGHT_GAME_PLAYS_PRIORITY_LIST: ReadonlyDeep<GamePlay[]> = GAME_PLAYS_PRIORITY_LIST.filter(({ occurrence }) => [GamePlayOccurrences.ONE_NIGHT_ONLY, GamePlayOccurrences.ON_NIGHTS].includes(occurrence));

const DAY_GAME_PLAYS_PRIORITY_LIST: ReadonlyDeep<GamePlay[]> = GAME_PLAYS_PRIORITY_LIST.filter(({ occurrence }) => occurrence === GamePlayOccurrences.ON_DAYS);

export {
  GAME_SOURCES,
  GAME_PLAYS_PRIORITY_LIST,
  NIGHT_GAME_PLAYS_PRIORITY_LIST,
  DAY_GAME_PLAYS_PRIORITY_LIST,
};