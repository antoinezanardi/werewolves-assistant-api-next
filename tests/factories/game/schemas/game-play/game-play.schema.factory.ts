import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GamePlayActions, GamePlayCauses, GamePlayOccurrences } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";

function createFakeGamePlayAccursedWolfFatherInfects(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    action: GamePlayActions.INFECT,
    source: createFakeGamePlaySource({ name: RoleNames.ACCURSED_WOLF_FATHER }),
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayBearTamerGrowls(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    action: GamePlayActions.GROWL,
    source: createFakeGamePlaySource({ name: RoleNames.BEAR_TAMER }),
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayActorChoosesCard(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.ACTOR }),
    action: GamePlayActions.CHOOSE_CARD,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySurvivorsBuryDeadBodies(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
    action: GamePlayActions.BURY_DEAD_BODIES,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL, ...gamePlay,
  }, override);
}

function createFakeGamePlaySheriffSettlesVotes(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
    action: GamePlayActions.SETTLE_VOTES,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySheriffDelegates(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
    action: GamePlayActions.DELEGATE,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySurvivorsVote(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  let occurrence = GamePlayOccurrences.ON_DAYS;
  if (gamePlay.cause === GamePlayCauses.ANGEL_PRESENCE) {
    occurrence = GamePlayOccurrences.ONE_NIGHT_ONLY;
  } else if ([GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES, GamePlayCauses.STUTTERING_JUDGE_REQUEST].includes(gamePlay.cause as GamePlayCauses)) {
    occurrence = GamePlayOccurrences.CONSEQUENTIAL;
  }
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
    action: GamePlayActions.VOTE,
    occurrence,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySurvivorsElectSheriff(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
    action: GamePlayActions.ELECT_SHERIFF,
    occurrence: GamePlayOccurrences.ANYTIME,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayThiefChoosesCard(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.THIEF }),
    action: GamePlayActions.CHOOSE_CARD,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayStutteringJudgeChoosesSign(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.STUTTERING_JUDGE }),
    action: GamePlayActions.CHOOSE_SIGN,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayScapegoatBansVoting(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.SCAPEGOAT }),
    action: GamePlayActions.BAN_VOTING,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWolfHoundChoosesSide(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.WOLF_HOUND }),
    action: GamePlayActions.CHOOSE_SIDE,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWildChildChoosesModel(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.WILD_CHILD }),
    action: GamePlayActions.CHOOSE_MODEL,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayFoxSniffs(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.FOX }),
    action: GamePlayActions.SNIFF,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayCharmedMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerGroups.CHARMED }),
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayLoversMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerGroups.LOVERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayThreeBrothersMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.THREE_BROTHERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayTwoSistersMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.TWO_SISTERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayScandalmongerMarks(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.SCANDALMONGER }),
    action: GamePlayActions.MARK,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayDefenderProtects(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.DEFENDER }),
    action: GamePlayActions.PROTECT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayHunterShoots(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.HUNTER }),
    action: GamePlayActions.SHOOT,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWitchUsesPotions(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.WITCH }),
    action: GamePlayActions.USE_POTIONS,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayPiedPiperCharms(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.PIED_PIPER }),
    action: GamePlayActions.CHARM,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayCupidCharms(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.CUPID }),
    action: GamePlayActions.CHARM,
    occurrence: GamePlayOccurrences.ONE_NIGHT_ONLY,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySeerLooks(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.SEER }),
    action: GamePlayActions.LOOK,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWhiteWerewolfEats(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.WHITE_WEREWOLF }),
    action: GamePlayActions.EAT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayBigBadWolfEats(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.BIG_BAD_WOLF }),
    action: GamePlayActions.EAT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWerewolvesEat(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerGroups.WEREWOLVES }),
    action: GamePlayActions.EAT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlay(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return plainToInstance(GamePlay, {
    action: gamePlay.action ?? faker.helpers.arrayElement(Object.values(GamePlayActions)),
    source: createFakeGamePlaySource(gamePlay.source),
    cause: gamePlay.cause ?? undefined,
    occurrence: gamePlay.occurrence ?? faker.helpers.arrayElement(Object.values(GamePlayOccurrences)),
    eligibleTargets: gamePlay.eligibleTargets ?? undefined,
    canBeSkipped: gamePlay.canBeSkipped ?? undefined,
    ...override,
  }, DEFAULT_PLAIN_TO_INSTANCE_OPTIONS);
}

export {
  createFakeGamePlayAccursedWolfFatherInfects,
  createFakeGamePlayBearTamerGrowls,
  createFakeGamePlayActorChoosesCard,
  createFakeGamePlaySurvivorsBuryDeadBodies,
  createFakeGamePlaySheriffSettlesVotes,
  createFakeGamePlaySheriffDelegates,
  createFakeGamePlaySurvivorsVote,
  createFakeGamePlaySurvivorsElectSheriff,
  createFakeGamePlayThiefChoosesCard,
  createFakeGamePlayStutteringJudgeChoosesSign,
  createFakeGamePlayScapegoatBansVoting,
  createFakeGamePlayWolfHoundChoosesSide,
  createFakeGamePlayWildChildChoosesModel,
  createFakeGamePlayFoxSniffs,
  createFakeGamePlayCharmedMeetEachOther,
  createFakeGamePlayLoversMeetEachOther,
  createFakeGamePlayThreeBrothersMeetEachOther,
  createFakeGamePlayTwoSistersMeetEachOther,
  createFakeGamePlayScandalmongerMarks,
  createFakeGamePlayDefenderProtects,
  createFakeGamePlayHunterShoots,
  createFakeGamePlayWitchUsesPotions,
  createFakeGamePlayPiedPiperCharms,
  createFakeGamePlayCupidCharms,
  createFakeGamePlaySeerLooks,
  createFakeGamePlayWhiteWerewolfEats,
  createFakeGamePlayBigBadWolfEats,
  createFakeGamePlayWerewolvesEat,
  createFakeGamePlay,
};