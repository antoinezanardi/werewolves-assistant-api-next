import { createCantFindPlayerUnexpectedException, createCantGenerateGamePlaysUnexpectedException, createNoCurrentGamePlayUnexpectedException, createNoGamePlayPriorityUnexpectedException, createPlayerIsDeadUnexpectedException } from "@/shared/exception/helpers/unexpected-exception.factory";

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
        error: `Can't find player with id "${interpolations.playerId.toString()}" in game "${interpolations.gameId.toString()}"`,
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
        error: `Player with id "${interpolations.playerId.toString()}" is dead in game "${interpolations.gameId.toString()}"`,
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
});