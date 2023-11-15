import { createCantFindLastNominatedPlayersUnexpectedException, createCantFindPlayerUnexpectedException, createCantGenerateGamePlaysUnexpectedException, createMalformedCurrentGamePlayUnexpectedException, createNoCurrentGamePlayUnexpectedException, createNoGamePlayPriorityUnexpectedException, createPlayerIsDeadUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

import { createFakeGamePlay } from "@tests/factories/game/schemas/game-play/game-play.schema.factory";
import { createFakeObjectId } from "@tests/factories/shared/mongoose/mongoose.factory";
import type { ExceptionResponse } from "@tests/types/exception/exception.types";

describe("Unexpected Exception Factory", () => {
  describe("createCantFindPlayerUnexpectedException", () => {
    it("should create player is dead unexpected exception when called.", () => {
      const interpolations = { gameId: createFakeObjectId(), playerId: createFakeObjectId() };
      const exception = createCantFindPlayerUnexpectedException("werewolvesEat", interpolations);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 500,
        message: "Unexpected exception in werewolvesEat",
        error: `Can't find player with id "${interpolations.playerId.toString()}" for game with id "${interpolations.gameId.toString()}"`,
      });
    });
  });

  describe("createPlayerIsDeadUnexpectedException", () => {
    it("should create player is dead unexpected exception when called.", () => {
      const interpolations = { gameId: createFakeObjectId(), playerId: createFakeObjectId() };
      const exception = createPlayerIsDeadUnexpectedException("killPlayer", interpolations);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 500,
        message: "Unexpected exception in killPlayer",
        error: `Player with id "${interpolations.playerId.toString()}" is dead in game with id "${interpolations.gameId.toString()}"`,
      });
    });
  });

  describe("createCantGenerateGamePlaysUnexpectedException", () => {
    it("should create can't generate game plays unexpected exception when called.", () => {
      const exception = createCantGenerateGamePlaysUnexpectedException("createGame");

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 500,
        message: "Unexpected exception in createGame",
        error: `Can't generate game plays`,
      });
    });
  });
  
  describe("createNoCurrentGamePlayUnexpectedException", () => {
    it("should create no current game play unexpected exception when called.", () => {
      const interpolations = { gameId: createFakeObjectId() };
      const exception = createNoCurrentGamePlayUnexpectedException("makePlay", interpolations);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 500,
        message: "Unexpected exception in makePlay",
        error: `Game with id "${interpolations.gameId.toString()}" doesn't have a current game play to deal with`,
      });
    });
  });

  describe("createNoGamePlayPriorityUnexpectedException", () => {
    it("should create no game play priority unexpected exception when called.", () => {
      const gamePlay = createFakeGamePlay();
      const exception = createNoGamePlayPriorityUnexpectedException("makePlay", gamePlay);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 500,
        message: "Unexpected exception in makePlay",
        error: `Game play "${JSON.stringify(gamePlay)}" doesn't have a set priority`,
      });
    });
  });

  describe("createMalformedCurrentGamePlayUnexpectedException", () => {
    it("should create malformed current game play unexpected exception when called.", () => {
      const gamePlay = createFakeGamePlay();
      const interpolations = { gameId: createFakeObjectId(), gamePlay };
      const exception = createMalformedCurrentGamePlayUnexpectedException("makePlay", gamePlay, interpolations.gameId);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 500,
        message: "Unexpected exception in makePlay",
        error: `Current game play with action "${interpolations.gamePlay.action}" and source "${interpolations.gamePlay.source.name}" are not consistent for game with id "${interpolations.gameId.toString()}"`,
      });
    });
  });

  describe("createCantFindLastNominatedPlayersUnexpectedException", () => {
    it("should create can't find last nominated players unexpected exception when called.", () => {
      const interpolations = { gameId: createFakeObjectId() };
      const exception = createCantFindLastNominatedPlayersUnexpectedException("makePlay", interpolations);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 500,
        message: "Unexpected exception in makePlay",
        error: `Can't find last nominated players for game with id "${interpolations.gameId.toString()}"`,
      });
    });
  });
});