import type { Types } from "mongoose";
import { UNEXPECTED_EXCEPTION_REASONS } from "../enums/unexpected-exception.enum";
import { UnexpectedException } from "../types/unexpected-exception.type";

function createCantFindPlayerUnexpectedException(scope: string, interpolations: { gameId: Types.ObjectId; playerId: Types.ObjectId }): UnexpectedException {
  const { gameId, playerId } = interpolations;
  return new UnexpectedException(scope, UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: gameId.toString(), playerId: playerId.toString() });
}

function createPlayerIsDeadUnexpectedException(scope: string, interpolations: { gameId: Types.ObjectId; playerId: Types.ObjectId }): UnexpectedException {
  const { gameId, playerId } = interpolations;
  return new UnexpectedException(scope, UNEXPECTED_EXCEPTION_REASONS.PLAYER_IS_DEAD, { gameId: gameId.toString(), playerId: playerId.toString() });
}

function createCantGenerateGamePlaysUnexpectedException(scope: string): UnexpectedException {
  return new UnexpectedException(scope, UNEXPECTED_EXCEPTION_REASONS.CANT_GENERATE_GAME_PLAYS);
}

function createNoCurrentGamePlayUnexpectedException(scope: string, interpolations: { gameId: Types.ObjectId }): UnexpectedException {
  const { gameId } = interpolations;
  return new UnexpectedException(scope, UNEXPECTED_EXCEPTION_REASONS.NO_CURRENT_GAME_PLAY, { gameId: gameId.toString() });
}

export {
  createCantFindPlayerUnexpectedException,
  createPlayerIsDeadUnexpectedException,
  createCantGenerateGamePlaysUnexpectedException,
  createNoCurrentGamePlayUnexpectedException,
};