import { faker } from "@faker-js/faker";
import { plainToInstance } from "class-transformer";
import { GAME_PLAY_ACTIONS } from "../../../../../src/modules/game/enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "../../../../../src/modules/game/enums/player.enum";
import { GamePlay } from "../../../../../src/modules/game/schemas/game-play/game-play.schema";
import { ROLE_NAMES } from "../../../../../src/modules/role/enums/role.enum";
import { plainToInstanceDefaultOptions } from "../../../../../src/shared/validation/constants/validation.constant";
import { createFakeGamePlaySource } from "./game-play-source.schema.factory";

function createFakeGamePlaySheriffSettlesVotes(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PLAYER_ATTRIBUTE_NAMES.SHERIFF }),
    action: GAME_PLAY_ACTIONS.SETTLE_VOTES,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySheriffDelegates(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PLAYER_ATTRIBUTE_NAMES.SHERIFF }),
    action: GAME_PLAY_ACTIONS.DELEGATE,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayAllVote(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PLAYER_GROUPS.ALL }),
    action: GAME_PLAY_ACTIONS.VOTE,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayAllElectSheriff(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PLAYER_GROUPS.ALL }),
    action: GAME_PLAY_ACTIONS.ELECT_SHERIFF,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayThiefChoosesCard(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.THIEF }),
    action: GAME_PLAY_ACTIONS.CHOOSE_CARD,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayStutteringJudgeChoosesSign(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.STUTTERING_JUDGE }),
    action: GAME_PLAY_ACTIONS.CHOOSE_SIGN,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayScapegoatBansVoting(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.SCAPEGOAT }),
    action: GAME_PLAY_ACTIONS.BAN_VOTING,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayDogWolfChoosesSide(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.DOG_WOLF }),
    action: GAME_PLAY_ACTIONS.CHOOSE_SIDE,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWildChildChoosesModel(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.WILD_CHILD }),
    action: GAME_PLAY_ACTIONS.CHOOSE_MODEL,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayFoxSniffs(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.FOX }),
    action: GAME_PLAY_ACTIONS.SNIFF,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayCharmedMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PLAYER_GROUPS.CHARMED }),
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayLoversMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PLAYER_GROUPS.LOVERS }),
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayThreeBrothersMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.THREE_BROTHERS }),
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayTwoSistersMeetEachOther(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.TWO_SISTERS }),
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayRavenMarks(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.RAVEN }),
    action: GAME_PLAY_ACTIONS.MARK,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayGuardProtects(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.GUARD }),
    action: GAME_PLAY_ACTIONS.PROTECT,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayHunterShoots(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.HUNTER }),
    action: GAME_PLAY_ACTIONS.SHOOT,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWitchUsesPotions(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.WITCH }),
    action: GAME_PLAY_ACTIONS.USE_POTIONS,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayPiedPiperCharms(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.PIED_PIPER }),
    action: GAME_PLAY_ACTIONS.CHARM,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayCupidCharms(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.CUPID }),
    action: GAME_PLAY_ACTIONS.CHARM,
    ...gamePlay,
  }, override);
}

function createFakeGamePlaySeerLooks(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.SEER }),
    action: GAME_PLAY_ACTIONS.LOOK,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWhiteWerewolfEats(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.WHITE_WEREWOLF }),
    action: GAME_PLAY_ACTIONS.EAT,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayBigBadWolfEats(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: ROLE_NAMES.BIG_BAD_WOLF }),
    action: GAME_PLAY_ACTIONS.EAT,
    ...gamePlay,
  }, override);
}

function createFakeGamePlayWerewolvesEat(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return createFakeGamePlay({
    source: createFakeGamePlaySource({ name: PLAYER_GROUPS.WEREWOLVES }),
    action: GAME_PLAY_ACTIONS.EAT,
    ...gamePlay,
  }, override);
}

function createFakeGamePlay(gamePlay: Partial<GamePlay> = {}, override: object = {}): GamePlay {
  return plainToInstance(GamePlay, {
    action: gamePlay.action ?? faker.helpers.arrayElement(Object.values(GAME_PLAY_ACTIONS)),
    source: createFakeGamePlaySource(gamePlay.source),
    cause: gamePlay.cause ?? undefined,
    ...override,
  }, plainToInstanceDefaultOptions);
}

export {
  createFakeGamePlaySheriffSettlesVotes,
  createFakeGamePlaySheriffDelegates,
  createFakeGamePlayAllVote,
  createFakeGamePlayAllElectSheriff,
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