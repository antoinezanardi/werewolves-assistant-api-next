import type { Types } from "mongoose";

import type { RoleNames } from "@/modules/role/enums/role.enum";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";

import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.types";

function createCantFindPlayerWithIdUnexpectedException(scope: string, interpolations: { gameId: Types.ObjectId; playerId: Types.ObjectId }): UnexpectedException {
  const { gameId, playerId } = interpolations;
  return new UnexpectedException(scope, UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: gameId.toString(), playerId: playerId.toString() });
}

function createCantFindPlayerWithCurrentRoleUnexpectedException(scope: string, interpolations: { gameId: Types.ObjectId; roleName: RoleNames }): UnexpectedException {
  const { gameId, roleName } = interpolations;
  return new UnexpectedException(scope, UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_CURRENT_ROLE_IN_GAME, { gameId: gameId.toString(), roleName });
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

function createCantFindLastDeadPlayersUnexpectedException(scope: string, interpolations: { gameId: Types.ObjectId }): UnexpectedException {
  const { gameId } = interpolations;
  return new UnexpectedException(scope, UnexpectedExceptionReasons.CANT_FIND_LAST_DEAD_PLAYERS, { gameId: gameId.toString() });
}

export {
  createCantFindPlayerWithIdUnexpectedException,
  createCantFindPlayerWithCurrentRoleUnexpectedException,
  createPlayerIsDeadUnexpectedException,
  createCantGenerateGamePlaysUnexpectedException,
  createNoCurrentGamePlayUnexpectedException,
  createNoGamePlayPriorityUnexpectedException,
  createMalformedCurrentGamePlayUnexpectedException,
  createCantFindLastNominatedPlayersUnexpectedException,
  createCantFindLastDeadPlayersUnexpectedException,
};