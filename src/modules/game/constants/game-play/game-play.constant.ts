import { createFakeGamePlaySheriffSettlesVotes } from "../../../../../tests/factories/game/schemas/game-play/game-play.schema.factory";
import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES } from "../../enums/game-play.enum";
import { createGamePlayAllElectSheriff, createGamePlayAllVote, createGamePlayBigBadWolfEats, createGamePlayCharmedMeetEachOther, createGamePlayCupidCharms, createGamePlayDogWolfChoosesSide, createGamePlayFoxSniffs, createGamePlayGuardProtects, createGamePlayHunterShoots, createGamePlayLoversMeetEachOther, createGamePlayPiedPiperCharms, createGamePlayRavenMarks, createGamePlayScapegoatBansVoting, createGamePlaySeerLooks, createGamePlaySheriffDelegates, createGamePlayStutteringJudgeChoosesSign, createGamePlayThiefChoosesCard, createGamePlayThreeBrothersMeetEachOther, createGamePlayTwoSistersMeetEachOther, createGamePlayWerewolvesEat, createGamePlayWhiteWerewolfEats, createGamePlayWildChildChoosesModel, createGamePlayWitchUsesPotions } from "../../helpers/game-play/game-play.factory";
import type { GamePlay } from "../../schemas/game-play/game-play.schema";

const requiredTargetsActions: Readonly<GAME_PLAY_ACTIONS[]> = Object.freeze([
  GAME_PLAY_ACTIONS.LOOK,
  GAME_PLAY_ACTIONS.CHARM,
  GAME_PLAY_ACTIONS.SHOOT,
  GAME_PLAY_ACTIONS.PROTECT,
  GAME_PLAY_ACTIONS.CHOOSE_MODEL,
  GAME_PLAY_ACTIONS.DELEGATE,
  GAME_PLAY_ACTIONS.SETTLE_VOTES,
]);

const optionalTargetsActions: Readonly<GAME_PLAY_ACTIONS[]> = Object.freeze([
  GAME_PLAY_ACTIONS.EAT,
  GAME_PLAY_ACTIONS.USE_POTIONS,
  GAME_PLAY_ACTIONS.MARK,
  GAME_PLAY_ACTIONS.SNIFF,
  GAME_PLAY_ACTIONS.BAN_VOTING,
]);

const requiredVotesActions: Readonly<GAME_PLAY_ACTIONS[]> = Object.freeze([
  GAME_PLAY_ACTIONS.VOTE,
  GAME_PLAY_ACTIONS.ELECT_SHERIFF,
]);

const stutteringJudgeRequestOpportunityActions: Readonly<GAME_PLAY_ACTIONS[]> = Object.freeze([
  GAME_PLAY_ACTIONS.VOTE,
  GAME_PLAY_ACTIONS.SETTLE_VOTES,
]);

const gamePlaysPriorityList: Readonly<GamePlay[]> = Object.freeze([
  createGamePlayHunterShoots(),
  createGamePlayAllElectSheriff({ cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES }),
  createGamePlayAllElectSheriff(),
  createGamePlaySheriffDelegates(),
  createGamePlayScapegoatBansVoting(),
  createFakeGamePlaySheriffSettlesVotes(),
  createGamePlayAllVote({ cause: GAME_PLAY_CAUSES.PREVIOUS_VOTES_WERE_IN_TIES }),
  createGamePlayAllVote({ cause: GAME_PLAY_CAUSES.ANGEL_PRESENCE }),
  createGamePlayAllVote({ cause: GAME_PLAY_CAUSES.STUTTERING_JUDGE_REQUEST }),
  createGamePlayAllVote(),
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
  requiredTargetsActions,
  optionalTargetsActions,
  requiredVotesActions,
  stutteringJudgeRequestOpportunityActions,
  gamePlaysPriorityList,
};