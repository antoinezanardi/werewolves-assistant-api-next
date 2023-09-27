import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import { createGamePlaySurvivorsElectSheriff, createGamePlaySurvivorsVote, createGamePlayBigBadWolfEats, createGamePlayCharmedMeetEachOther, createGamePlayCupidCharms, createGamePlayDogWolfChoosesSide, createGamePlayFoxSniffs, createGamePlayGuardProtects, createGamePlayHunterShoots, createGamePlayLoversMeetEachOther, createGamePlayPiedPiperCharms, createGamePlayRavenMarks, createGamePlayScapegoatBansVoting, createGamePlaySeerLooks, createGamePlaySheriffDelegates, createGamePlayStutteringJudgeChoosesSign, createGamePlayThiefChoosesCard, createGamePlayThreeBrothersMeetEachOther, createGamePlayTwoSistersMeetEachOther, createGamePlayWerewolvesEat, createGamePlayWhiteWerewolfEats, createGamePlayWildChildChoosesModel, createGamePlayWitchUsesPotions, createGamePlaySheriffSettlesVotes } from "@/modules/game/helpers/game-play/game-play.factory";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";

const REQUIRED_TARGET_ACTIONS: Readonly<GamePlayActions[]> = Object.freeze([
  GamePlayActions.LOOK,
  GamePlayActions.CHARM,
  GamePlayActions.SHOOT,
  GamePlayActions.PROTECT,
  GamePlayActions.CHOOSE_MODEL,
  GamePlayActions.DELEGATE,
  GamePlayActions.SETTLE_VOTES,
]);

const OPTIONAL_TARGET_ACTIONS: Readonly<GamePlayActions[]> = Object.freeze([
  GamePlayActions.EAT,
  GamePlayActions.USE_POTIONS,
  GamePlayActions.MARK,
  GamePlayActions.SNIFF,
  GamePlayActions.BAN_VOTING,
]);

const REQUIRED_VOTE_ACTIONS: Readonly<GamePlayActions[]> = Object.freeze([
  GamePlayActions.VOTE,
  GamePlayActions.ELECT_SHERIFF,
]);

const STUTTERING_JUDGE_REQUEST_OPPORTUNITY_ACTIONS: Readonly<GamePlayActions[]> = Object.freeze([
  GamePlayActions.VOTE,
  GamePlayActions.SETTLE_VOTES,
]);

const GAME_PLAYS_PRIORITY_LIST: Readonly<GamePlay[]> = Object.freeze([
  createGamePlayHunterShoots(),
  createGamePlaySurvivorsElectSheriff({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
  createGamePlaySurvivorsElectSheriff(),
  createGamePlaySheriffDelegates(),
  createGamePlayScapegoatBansVoting(),
  createGamePlaySheriffSettlesVotes(),
  createGamePlaySurvivorsVote({ cause: GamePlayCauses.PREVIOUS_VOTES_WERE_IN_TIES }),
  createGamePlaySurvivorsVote({ cause: GamePlayCauses.ANGEL_PRESENCE }),
  createGamePlaySurvivorsVote({ cause: GamePlayCauses.STUTTERING_JUDGE_REQUEST }),
  createGamePlaySurvivorsVote(),
  createGamePlayThiefChoosesCard(),
  createGamePlayDogWolfChoosesSide(),
  createGamePlayCupidCharms(),
  createGamePlaySeerLooks(),
  createGamePlayFoxSniffs(),
  createGamePlayLoversMeetEachOther(),
  createGamePlayStutteringJudgeChoosesSign(),
  createGamePlayTwoSistersMeetEachOther(),
  createGamePlayThreeBrothersMeetEachOther(),
  createGamePlayWildChildChoosesModel(),
  createGamePlayRavenMarks(),
  createGamePlayGuardProtects(),
  createGamePlayWerewolvesEat(),
  createGamePlayWhiteWerewolfEats(),
  createGamePlayBigBadWolfEats(),
  createGamePlayWitchUsesPotions(),
  createGamePlayPiedPiperCharms(),
  createGamePlayCharmedMeetEachOther(),
]);

export {
  REQUIRED_TARGET_ACTIONS,
  OPTIONAL_TARGET_ACTIONS,
  REQUIRED_VOTE_ACTIONS,
  STUTTERING_JUDGE_REQUEST_OPPORTUNITY_ACTIONS,
  GAME_PLAYS_PRIORITY_LIST,
};