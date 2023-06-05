import { UNEXPECTED_EXCEPTION_REASONS } from "../../../../../../src/shared/exception/enums/unexpected-exception.enum";
import { UnexpectedException } from "../../../../../../src/shared/exception/types/unexpected-exception.type";
import type { ExceptionResponse } from "../../../../../types/exception/exception.types";

describe("Unexpected exception type", () => {
  describe("getResponse", () => {
    it("should get response with description without interpolations when interpolations are not necessary.", () => {
      const exception = new UnexpectedException("werewolvesEat", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 500,
        message: `Unexpected exception in werewolvesEat`,
        error: "Can't find player with id \"playerId\" in game \"gameId\"",
      });
    });

    it("should get response with description with interpolations when interpolations necessary.", () => {
      const exception = new UnexpectedException("werewolvesEat", UNEXPECTED_EXCEPTION_REASONS.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: "123", playerId: "456" });

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 500,
        message: `Unexpected exception in werewolvesEat`,
        error: `Can't find player with id "456" in game "123"`,
      });
    });
  });
});