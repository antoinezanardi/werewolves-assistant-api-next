import { plainToInstance } from "class-transformer";

import { GamePlayActions, GamePlayCauses, GamePlayOccurrences } from "@/modules/game/enums/game-play.enum";
import { PlayerAttributeNames, PlayerGroups } from "@/modules/game/enums/player.enum";
import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { RoleNames } from "@/modules/role/enums/role.enum";

import { DEFAULT_PLAIN_TO_INSTANCE_OPTIONS } from "@/shared/validation/constants/validation.constant";

function createGamePlaySurvivorsBuryDeadBodies(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerGroups.SURVIVORS }),
    action: GamePlayActions.BURY_DEAD_BODIES,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
    ...gamePlay,
  });
}

function createGamePlaySheriffSettlesVotes(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
    action: GamePlayActions.SETTLE_VOTES,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
    ...gamePlay,
  });
}

function createGamePlaySheriffDelegates(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerAttributeNames.SHERIFF }),
    action: GamePlayActions.DELEGATE,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
    ...gamePlay,
  });
}

function createGamePlaySurvivorsVote(gamePlay: Partial<GamePlay> = {}): GamePlay {
  let occurrence: GamePlayOccurrences = GamePlayOccurrences.ON_DAYS;
  if (gamePlay.cause === GamePlayCauses.ANGEL_PRESENCE) {
    occurrence = GamePlayOccurrences.FIRST_NIGHT_ONLY;
  } else if ([GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES, GamePlayCauses.STUTTERING_JUDGE_REQUEST].includes(gamePlay.cause as GamePlayCauses)) {
    occurrence = GamePlayOccurrences.CONSEQUENTIAL;
  }
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerGroups.SURVIVORS }),
    action: GamePlayActions.VOTE,
    occurrence,
    ...gamePlay,
  });
}

function createGamePlaySurvivorsElectSheriff(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerGroups.SURVIVORS }),
    action: GamePlayActions.ELECT_SHERIFF,
    occurrence: GamePlayOccurrences.ANYTIME,
    ...gamePlay,
  });
}

function createGamePlayThiefChoosesCard(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.THIEF }),
    action: GamePlayActions.CHOOSE_CARD,
    occurrence: GamePlayOccurrences.FIRST_NIGHT_ONLY,
    ...gamePlay,
  });
}

function createGamePlayStutteringJudgeChoosesSign(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.STUTTERING_JUDGE }),
    action: GamePlayActions.CHOOSE_SIGN,
    occurrence: GamePlayOccurrences.FIRST_NIGHT_ONLY,
    ...gamePlay,
  });
}

function createGamePlayScapegoatBansVoting(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.SCAPEGOAT }),
    action: GamePlayActions.BAN_VOTING,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
    ...gamePlay,
  });
}

function createGamePlayWolfHoundChoosesSide(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.WOLF_HOUND }),
    action: GamePlayActions.CHOOSE_SIDE,
    occurrence: GamePlayOccurrences.FIRST_NIGHT_ONLY,
    ...gamePlay,
  });
}

function createGamePlayWildChildChoosesModel(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.WILD_CHILD }),
    action: GamePlayActions.CHOOSE_MODEL,
    occurrence: GamePlayOccurrences.FIRST_NIGHT_ONLY,
    ...gamePlay,
  });
}

function createGamePlayFoxSniffs(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.FOX }),
    action: GamePlayActions.SNIFF,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlayCharmedMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerGroups.CHARMED }),
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlayLoversMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerGroups.LOVERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.FIRST_NIGHT_ONLY,
    ...gamePlay,
  });
}

function createGamePlayThreeBrothersMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.THREE_BROTHERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlayTwoSistersMeetEachOther(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.TWO_SISTERS }),
    action: GamePlayActions.MEET_EACH_OTHER,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlayScandalmongerMarks(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.SCANDALMONGER }),
    action: GamePlayActions.MARK,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlayDefenderProtects(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.DEFENDER }),
    action: GamePlayActions.PROTECT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlayHunterShoots(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.HUNTER }),
    action: GamePlayActions.SHOOT,
    occurrence: GamePlayOccurrences.CONSEQUENTIAL,
    ...gamePlay,
  });
}

function createGamePlayWitchUsesPotions(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.WITCH }),
    action: GamePlayActions.USE_POTIONS,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlayPiedPiperCharms(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.PIED_PIPER }),
    action: GamePlayActions.CHARM,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlayCupidCharms(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.CUPID }),
    action: GamePlayActions.CHARM,
    occurrence: GamePlayOccurrences.FIRST_NIGHT_ONLY,
    ...gamePlay,
  });
}

function createGamePlaySeerLooks(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.SEER }),
    action: GamePlayActions.LOOK,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlayWhiteWerewolfEats(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.WHITE_WEREWOLF }),
    action: GamePlayActions.EAT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlayBigBadWolfEats(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: RoleNames.BIG_BAD_WOLF }),
    action: GamePlayActions.EAT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlayWerewolvesEat(gamePlay: Partial<GamePlay> = {}): GamePlay {
  return createGamePlay({
    source: createGamePlaySource({ name: PlayerGroups.WEREWOLVES }),
    action: GamePlayActions.EAT,
    occurrence: GamePlayOccurrences.ON_NIGHTS,
    ...gamePlay,
  });
}

function createGamePlaySource(gamePlaySource: GamePlaySource): GamePlaySource {
  return plainToInstance(GamePlaySource, gamePlaySource, { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true });
}

function createGamePlay(gamePlay: GamePlay): GamePlay {
  return plainToInstance(GamePlay, gamePlay, { ...DEFAULT_PLAIN_TO_INSTANCE_OPTIONS, excludeExtraneousValues: true });
}

export {
  createGamePlaySurvivorsBuryDeadBodies,
  createGamePlaySheriffSettlesVotes,
  createGamePlaySheriffDelegates,
  createGamePlaySurvivorsVote,
  createGamePlaySurvivorsElectSheriff,
  createGamePlayThiefChoosesCard,
  createGamePlayStutteringJudgeChoosesSign,
  createGamePlayScapegoatBansVoting,
  createGamePlayWolfHoundChoosesSide,
  createGamePlayWildChildChoosesModel,
  createGamePlayFoxSniffs,
  createGamePlayCharmedMeetEachOther,
  createGamePlayLoversMeetEachOther,
  createGamePlayThreeBrothersMeetEachOther,
  createGamePlayTwoSistersMeetEachOther,
  createGamePlayScandalmongerMarks,
  createGamePlayDefenderProtects,
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