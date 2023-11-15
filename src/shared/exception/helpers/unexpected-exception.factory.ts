import type { Types } from "mongoose";

import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";

import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.type";

function createCantFindPlayerUnexpectedException(scope: string, interpolations: { gameId: Types.ObjectId; playerId: Types.ObjectId }): UnexpectedException {
  const { gameId, playerId } = interpolations;
  return new UnexpectedException(scope, UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: gameId.toString(), playerId: playerId.toString() });
}

function createPlayerIsDeadUnexpectedException(scope: string, interpolations: { gameId: Types.ObjectId; playerId: Types.ObjectId }): UnexpectedException {
  const { gameId, playerId } = interpolations;
  return new UnexpectedException(scope, UnexpectedExceptionReasons.PLAYER_IS_DEAD, { gameId: gameId.toString(), playerId: playerId.toString() });
}

function createCantGenerateGamePlaysUnexpectedException(scope: string): UnexpectedException {
  return new UnexpectedException(scope, UnexpectedExceptionReasons.CANT_GENERATE_GAME_PLAYS);
}

function createNoCurrentGamePlayUnexpectedException(scope: string, interpolations: { gameId: Types.ObjectId }): UnexpectedException {
  const { gameId } = interpolations;
  return new UnexpectedException(scope, UnexpectedExceptionReasons.NO_CURRENT_GAME_PLAY, { gameId: gameId.toString() });
}

function createNoGamePlayPriorityUnexpectedException(scope: string, gamePlay: GamePlay): UnexpectedException {
  return new UnexpectedException(scope, UnexpectedExceptionReasons.NO_GAME_PLAY_PRIORITY, { gamePlay: JSON.stringify(gamePlay) });
}

function createMalformedCurrentGamePlayUnexpectedException(scope: string, gamePlay: GamePlay, gameId: Types.ObjectId): UnexpectedException {
  const interpolations = { action: gamePlay.action, source: gamePlay.source.name, gameId: gameId.toString() };
  return new UnexpectedException(scope, UnexpectedExceptionReasons.MALFORMED_CURRENT_GAME_PLAY, interpolations);
}

function createCantFindLastNominatedPlayersUnexpectedException(scope: string, interpolations: { gameId: Types.ObjectId }): UnexpectedException {
  const { gameId } = interpolations;
  return new UnexpectedException(scope, UnexpectedExceptionReasons.CANT_FIND_LAST_NOMINATED_PLAYERS, { gameId: gameId.toString() });
}

export {
  createCantFindPlayerUnexpectedException,
  createPlayerIsDeadUnexpectedException,
  createCantGenerateGamePlaysUnexpectedException,
  createNoCurrentGamePlayUnexpectedException,
  createNoGamePlayPriorityUnexpectedException,
  createMalformedCurrentGamePlayUnexpectedException,
  createCantFindLastNominatedPlayersUnexpectedException,
};