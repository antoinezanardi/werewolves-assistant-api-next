import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import type { GameSource } from "@/modules/game/types/game.type";
import { RoleNames } from "@/modules/role/enums/role.enum";

const GAME_SOURCE_VALUES: Readonly<GameSource[]> = Object.freeze([
  ...Object.values(PlayerGroups),
  ...Object.values(RoleNames),
  PlayerAttributeNames.SHERIFF,
]);

const GAME_PLAYS_NIGHT_ORDER: Readonly<(GamePlay & { isFirstNightOnly?: boolean })[]> = Object.freeze([
  {
    source: { name: PlayerGroups.SURVIVORS },
    action: GamePlayActions.VOTE,
    cause: GamePlayCauses.ANGEL_PRESENCE,
    isFirstNightOnly: true,
  },
  {
    source: { name: RoleNames.THIEF },
    action: GamePlayActions.CHOOSE_CARD,
    isFirstNightOnly: true,
  },
  {
    source: { name: RoleNames.DOG_WOLF },
    action: GamePlayActions.CHOOSE_SIDE,
    isFirstNightOnly: true,
  },
  {
    source: { name: RoleNames.CUPID },
    action: GamePlayActions.CHARM,
    isFirstNightOnly: true,
  },
  {
    source: { name: RoleNames.SEER },
    action: GamePlayActions.LOOK,
  },
  {
    source: { name: RoleNames.FOX },
    action: GamePlayActions.SNIFF,
  },
  {
    source: { name: PlayerGroups.LOVERS },
    action: GamePlayActions.MEET_EACH_OTHER,
    isFirstNightOnly: true,
  },
  {
    source: { name: RoleNames.STUTTERING_JUDGE },
    action: GamePlayActions.CHOOSE_SIGN,
    isFirstNightOnly: true,
  },
  {
    source: { name: RoleNames.TWO_SISTERS },
    action: GamePlayActions.MEET_EACH_OTHER,
  },
  {
    source: { name: RoleNames.THREE_BROTHERS },
    action: GamePlayActions.MEET_EACH_OTHER,
  },
  {
    source: { name: RoleNames.WILD_CHILD },
    action: GamePlayActions.CHOOSE_MODEL,
    isFirstNightOnly: true,
  },
  {
    source: { name: RoleNames.RAVEN },
    action: GamePlayActions.MARK,
  },
  {
    source: { name: RoleNames.GUARD },
    action: GamePlayActions.PROTECT,
  },
  {
    source: { name: PlayerGroups.WEREWOLVES },
    action: GamePlayActions.EAT,
  },
  {
    source: { name: RoleNames.WHITE_WEREWOLF },
    action: GamePlayActions.EAT,
  },
  {
    source: { name: RoleNames.BIG_BAD_WOLF },
    action: GamePlayActions.EAT,
  },
  {
    source: { name: RoleNames.WITCH },
    action: GamePlayActions.USE_POTIONS,
  },
  {
    source: { name: RoleNames.PIED_PIPER },
    action: GamePlayActions.CHARM,
  },
  {
    source: { name: PlayerGroups.CHARMED },
    action: GamePlayActions.MEET_EACH_OTHER,
  },
]);

export {
  GAME_SOURCE_VALUES,
  GAME_PLAYS_NIGHT_ORDER,
};