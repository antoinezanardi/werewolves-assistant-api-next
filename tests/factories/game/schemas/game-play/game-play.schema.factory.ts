import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";

import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

import { createFakeGamePlaySource } from "@tests/factories/game/schemas/game-play/game-play-source.schema.factory";

function createFakeGamePlaySheriffSettlesVotes(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
    action: GamePlayActions.SETTLE_VOTES,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySheriffDelegates(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
    action: GamePlayActions.DELEGATE,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySurvivorsVote(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
    action: GamePlayActions.VOTE,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySurvivorsElectSheriff(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerGroups.SURVIVORS }),
    action: GamePlayActions.ELECT_SHERIFF,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayThiefChoosesCard(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.THIEF }),
    action: GamePlayActions.CHOOSE_CARD,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayStutteringJudgeChoosesSign(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.STUTTERING_JUDGE }),
    action: GamePlayActions.CHOOSE_SIGN,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayScapegoatBansVoting(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.SCAPEGOAT }),
    action: GamePlayActions.BAN_VOTING,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayDogWolfChoosesSide(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.DOG_WOLF }),
    action: GamePlayActions.CHOOSE_SIDE,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWildChildChoosesModel(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.WILD_CHILD }),
    action: GamePlayActions.CHOOSE_MODEL,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayFoxSniffs(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.FOX }),
    action: GamePlayActions.SNIFF,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayCharmedMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerGroups.CHARMED }),
    action: GamePlayActions.MEET_EACH_OTHER,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayLoversMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerGroups.LOVERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayThreeBrothersMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.THREE_BROTHERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayTwoSistersMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.TWO_SISTERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayRavenMarks(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.RAVEN }),
    action: GamePlayActions.MARK,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayGuardProtects(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.GUARD }),
    action: GamePlayActions.PROTECT,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayHunterShoots(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.HUNTER }),
    action: GamePlayActions.SHOOT,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWitchUsesPotions(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.WITCH }),
    action: GamePlayActions.USE_POTIONS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayPiedPiperCharms(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.PIED_PIPER }),
    action: GamePlayActions.CHARM,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayCupidCharms(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.CUPID }),
    action: GamePlayActions.CHARM,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySeerLooks(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.SEER }),
    action: GamePlayActions.LOOK,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWhiteWerewolfEats(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.WHITE_WEREWOLF }),
    action: GamePlayActions.EAT,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayBigBadWolfEats(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: RoleNames.BIG_BAD_WOLF }),
    action: GamePlayActions.EAT,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWerewolvesEat(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PlayerGroups.WEREWOLVES }),
    action: GamePlayActions.EAT,
    ...gamePlay,
  }, override);
}

function createFakeGamePlay(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return plainToInstance(GamePlay, {
    action: gamePlay.action ?? faker.helpers.arrayElement(Object.values(GamePlayActions)),
    source: createFakeGamePlaySource(gamePlay.source),
    cause: gamePlay.cause ?? undefined,
    ...override,
  }, PLAIN_TO_INSTANCE_DEFAULT_OPTIONS);
}

export {
  createFakeGamePlaySheriffSettlesVotes,
  createFakeGamePlaySheriffDelegates,
  createFakeGamePlaySurvivorsVote,
  createFakeGamePlaySurvivorsElectSheriff,
  createFakeGamePlayThiefChoosesCard,
  createFakeGamePlayStutteringJudgeChoosesSign,
  createFakeGamePlayScapegoatBansVoting,
  createFakeGamePlayDogWolfChoosesSide,
  createFakeGamePlayWildChildChoosesModel,
  createFakeGamePlayFoxSniffs,
  createFakeGamePlayCharmedMeetEachOther,
  createFakeGamePlayLoversMeetEachOther,
  createFakeGamePlayThreeBrothersMeetEachOther,
  createFakeGamePlayTwoSistersMeetEachOther,
  createFakeGamePlayRavenMarks,
  createFakeGamePlayGuardProtects,
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