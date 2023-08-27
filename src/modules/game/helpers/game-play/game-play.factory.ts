import { plainToInstance } from "class-transformer";

import { GAME_PLAY_ACTIONS } from "@/modules/game/enums/game-play.enum";
import { PLAYER_ATTRIBUTE_NAMES, PLAYER_GROUPS } from "@/modules/game/enums/player.enum";
import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

import { plainToInstanceDefaultOptions } from "@/shared/validation/constants/validation.constant";

function createGamePlaySheriffSettlesVotes(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PLAYER_ATTRIBUTE_NAMES.SHERIFF }),
    action: GAME_PLAY_ACTIONS.SETTLE_VOTES,
    ...gamePlay,
  });
}

function createGamePlaySheriffDelegates(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PLAYER_ATTRIBUTE_NAMES.SHERIFF }),
    action: GAME_PLAY_ACTIONS.DELEGATE,
    ...gamePlay,
  });
}

function createGamePlayAllVote(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PLAYER_GROUPS.ALL }),
    action: GAME_PLAY_ACTIONS.VOTE,
    ...gamePlay,
  });
}

function createGamePlayAllElectSheriff(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PLAYER_GROUPS.ALL }),
    action: GAME_PLAY_ACTIONS.ELECT_SHERIFF,
    ...gamePlay,
  });
}

function createGamePlayThiefChoosesCard(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.THIEF }),
    action: GAME_PLAY_ACTIONS.CHOOSE_CARD,
    ...gamePlay,
  });
}

function createGamePlayStutteringJudgeChoosesSign(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.STUTTERING_JUDGE }),
    action: GAME_PLAY_ACTIONS.CHOOSE_SIGN,
    ...gamePlay,
  });
}

function createGamePlayScapegoatBansVoting(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.SCAPEGOAT }),
    action: GAME_PLAY_ACTIONS.BAN_VOTING,
    ...gamePlay,
  });
}

function createGamePlayDogWolfChoosesSide(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.DOG_WOLF }),
    action: GAME_PLAY_ACTIONS.CHOOSE_SIDE,
    ...gamePlay,
  });
}

function createGamePlayWildChildChoosesModel(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.WILD_CHILD }),
    action: GAME_PLAY_ACTIONS.CHOOSE_MODEL,
    ...gamePlay,
  });
}

function createGamePlayFoxSniffs(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.FOX }),
    action: GAME_PLAY_ACTIONS.SNIFF,
    ...gamePlay,
  });
}

function createGamePlayCharmedMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PLAYER_GROUPS.CHARMED }),
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    ...gamePlay,
  });
}

function createGamePlayLoversMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PLAYER_GROUPS.LOVERS }),
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    ...gamePlay,
  });
}

function createGamePlayThreeBrothersMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.THREE_BROTHERS }),
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    ...gamePlay,
  });
}

function createGamePlayTwoSistersMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.TWO_SISTERS }),
    action: GAME_PLAY_ACTIONS.MEET_EACH_OTHER,
    ...gamePlay,
  });
}

function createGamePlayRavenMarks(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.RAVEN }),
    action: GAME_PLAY_ACTIONS.MARK,
    ...gamePlay,
  });
}

function createGamePlayGuardProtects(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.GUARD }),
    action: GAME_PLAY_ACTIONS.PROTECT,
    ...gamePlay,
  });
}

function createGamePlayHunterShoots(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.HUNTER }),
    action: GAME_PLAY_ACTIONS.SHOOT,
    ...gamePlay,
  });
}

function createGamePlayWitchUsesPotions(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.WITCH }),
    action: GAME_PLAY_ACTIONS.USE_POTIONS,
    ...gamePlay,
  });
}

function createGamePlayPiedPiperCharms(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.PIED_PIPER }),
    action: GAME_PLAY_ACTIONS.CHARM,
    ...gamePlay,
  });
}

function createGamePlayCupidCharms(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.CUPID }),
    action: GAME_PLAY_ACTIONS.CHARM,
    ...gamePlay,
  });
}

function createGamePlaySeerLooks(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.SEER }),
    action: GAME_PLAY_ACTIONS.LOOK,
    ...gamePlay,
  });
}

function createGamePlayWhiteWerewolfEats(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.WHITE_WEREWOLF }),
    action: GAME_PLAY_ACTIONS.EAT,
    ...gamePlay,
  });
}

function createGamePlayBigBadWolfEats(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: ROLE_NAMES.BIG_BAD_WOLF }),
    action: GAME_PLAY_ACTIONS.EAT,
    ...gamePlay,
  });
}

function createGamePlayWerewolvesEat(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PLAYER_GROUPS.WEREWOLVES }),
    action: GAME_PLAY_ACTIONS.EAT,
    ...gamePlay,
  });
}

function createGamePlaySource(gamePlaySource: GamePlaySource): GamePlaySource {
  return plainToInstance(GamePlaySource, gamePlaySource, { ...plainToInstanceDefaultOptions, excludeExtraneousValues: true });
}

function createGamePlay(gamePlay: GamePlay): GamePlay {
  return plainToInstance(GamePlay, gamePlay, { ...plainToInstanceDefaultOptions, excludeExtraneousValues: true });
}

export {
  createGamePlaySheriffSettlesVotes,
  createGamePlaySheriffDelegates,
  createGamePlayAllVote,
  createGamePlayAllElectSheriff,
  createGamePlayThiefChoosesCard,
  createGamePlayStutteringJudgeChoosesSign,
  createGamePlayScapegoatBansVoting,
  createGamePlayDogWolfChoosesSide,
  createGamePlayWildChildChoosesModel,
  createGamePlayFoxSniffs,
  createGamePlayCharmedMeetEachOther,
  createGamePlayLoversMeetEachOther,
  createGamePlayThreeBrothersMeetEachOther,
  createGamePlayTwoSistersMeetEachOther,
  createGamePlayRavenMarks,
  createGamePlayGuardProtects,
  createGamePlayHunterShoots,
  createGamePlayWitchUsesPotions,
  createGamePlayPiedPiperCharms,
  createGamePlayCupidCharms,
  createGamePlaySeerLooks,
  createGamePlayWhiteWerewolfEats,
  createGamePlayBigBadWolfEats,
  createGamePlayWerewolvesEat,
  createGamePlaySource,
  createGamePlay,
};