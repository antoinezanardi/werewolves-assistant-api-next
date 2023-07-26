import { createCantFindPlayerUnexpectedException, createCantGenerateGamePlaysUnexpectedException, createPlayerIsDeadUnexpectedException } from "../../../../../../src/shared/exception/helpers/unexpected-exception.factory";
import { createFakeObjectId } from "../../../../../factories/shared/mongoose/mongoose.factory";
import type { ExceptionResponse } from "../../../../../types/exception/exception.types";

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
  
  describe("createCantGenerateGamePlaysUnexpectedException", () => {
    it.todo("should  when .");
  });
});