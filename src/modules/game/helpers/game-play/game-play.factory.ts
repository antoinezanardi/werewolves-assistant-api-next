import { plainToInstance } from "class-transformer";

import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { PLAIN_TO_INSTANCE_DEFAULT_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createGamePlaySheriffSettlesVotes(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
    action: GamePlayActions.SETTLE_VOTES,
    ...gamePlay,
  });
}

function createGamePlaySheriffDelegates(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
    action: GamePlayActions.DELEGATE,
    ...gamePlay,
  });
}

function createGamePlayAllVote(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerGroups.ALL }),
    action: GamePlayActions.VOTE,
    ...gamePlay,
  });
}

function createGamePlayAllElectSheriff(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerGroups.ALL }),
    action: GamePlayActions.ELECT_SHERIFF,
    ...gamePlay,
  });
}

function createGamePlayThiefChoosesCard(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.THIEF }),
    action: GamePlayActions.CHOOSE_CARD,
    ...gamePlay,
  });
}

function createGamePlayStutteringJudgeChoosesSign(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.STUTTERING_JUDGE }),
    action: GamePlayActions.CHOOSE_SIGN,
    ...gamePlay,
  });
}

function createGamePlayScapegoatBansVoting(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.SCAPEGOAT }),
    action: GamePlayActions.BAN_VOTING,
    ...gamePlay,
  });
}

function createGamePlayDogWolfChoosesSide(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.DOG_WOLF }),
    action: GamePlayActions.CHOOSE_SIDE,
    ...gamePlay,
  });
}

function createGamePlayWildChildChoosesModel(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.WILD_CHILD }),
    action: GamePlayActions.CHOOSE_MODEL,
    ...gamePlay,
  });
}

function createGamePlayFoxSniffs(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.FOX }),
    action: GamePlayActions.SNIFF,
    ...gamePlay,
  });
}

function createGamePlayCharmedMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerGroups.CHARMED }),
    action: GamePlayActions.MEET_EACH_OTHER,
    ...gamePlay,
  });
}

function createGamePlayLoversMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerGroups.LOVERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    ...gamePlay,
  });
}

function createGamePlayThreeBrothersMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.THREE_BROTHERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    ...gamePlay,
  });
}

function createGamePlayTwoSistersMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.TWO_SISTERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    ...gamePlay,
  });
}

function createGamePlayRavenMarks(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.RAVEN }),
    action: GamePlayActions.MARK,
    ...gamePlay,
  });
}

function createGamePlayGuardProtects(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.GUARD }),
    action: GamePlayActions.PROTECT,
    ...gamePlay,
  });
}

function createGamePlayHunterShoots(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.HUNTER }),
    action: GamePlayActions.SHOOT,
    ...gamePlay,
  });
}

function createGamePlayWitchUsesPotions(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.WITCH }),
    action: GamePlayActions.USE_POTIONS,
    ...gamePlay,
  });
}

function createGamePlayPiedPiperCharms(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.PIED_PIPER }),
    action: GamePlayActions.CHARM,
    ...gamePlay,
  });
}

function createGamePlayCupidCharms(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.CUPID }),
    action: GamePlayActions.CHARM,
    ...gamePlay,
  });
}

function createGamePlaySeerLooks(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.SEER }),
    action: GamePlayActions.LOOK,
    ...gamePlay,
  });
}

function createGamePlayWhiteWerewolfEats(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.WHITE_WEREWOLF }),
    action: GamePlayActions.EAT,
    ...gamePlay,
  });
}

function createGamePlayBigBadWolfEats(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.BIG_BAD_WOLF }),
    action: GamePlayActions.EAT,
    ...gamePlay,
  });
}

function createGamePlayWerewolvesEat(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerGroups.WEREWOLVES }),
    action: GamePlayActions.EAT,
    ...gamePlay,
  });
}

function createGamePlaySource(gamePlaySource: GamePlaySource): GamePlaySource {
  return plainToInstance(GamePlaySource, gamePlaySource, { ...PLAIN_TO_INSTANCE_DEFAULT_OPTIONS, excludeExtraneousValues: true });
}

function createGamePlay(gamePlay: GamePlay): GamePlay {
  return plainToInstance(GamePlay, gamePlay, { ...PLAIN_TO_INSTANCE_DEFAULT_OPTIONS, excludeExtraneousValues: true });
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