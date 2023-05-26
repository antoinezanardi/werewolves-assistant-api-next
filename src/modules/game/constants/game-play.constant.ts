import type { ApiPropertyOptions } from "@nestjs/swagger";
import { GAME_PLAY_ACTIONS } from "../enums/game-play.enum";
import { PLAYER_GROUPS } from "../enums/player.enum";
import type { GamePlay } from "../schemas/game-play.schema";
import { gameSourceValues } from "./game.constant";

const gamePlayApiProperties: Readonly<Record<keyof GamePlay, ApiPropertyOptions>> = Object.freeze({
  source: {
    description: "Which role or group of people need to perform this action",
    enum: gameSourceValues,
  },
  action: {
    description: "What action need to be performed for this play",
    example: GAME_PLAY_ACTIONS.VOTE,
  },
  cause: { description: "Why this play needs to be performed" },
});

const sheriffElectionPlay: Readonly<GamePlay> = Object.freeze({
  source: PLAYER_GROUPS.ALL,
  action: GAME_PLAY_ACTIONS.ELECT_SHERIFF,
});

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

export {
  gamePlayApiProperties,
  sheriffElectionPlay,
  requiredTargetsActions,
  optionalTargetsActions,
  requiredVotesActions,
  stutteringJudgeRequestOpportunityActions,
};