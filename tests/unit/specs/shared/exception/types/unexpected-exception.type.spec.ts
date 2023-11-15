import { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import { UnexpectedException } from "@/shared/exception/types/unexpected-exception.type";

import type { ExceptionResponse } from "@tests/types/exception/exception.types";

describe("Unexpected exception type", () => {
  describe("getResponse", () => {
    it("should get response with description without interpolations when interpolations are not necessary.", () => {
      const exception = new UnexpectedException("werewolvesEat", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 500,
        message: `Unexpected exception in werewolvesEat`,
        error: "Can't find player with id \"undefined\" for game with id \"undefined\"",
      });
    });

    it("should get response with description with interpolations when interpolations necessary.", () => {
      const exception = new UnexpectedException("werewolvesEat", UnexpectedExceptionReasons.CANT_FIND_PLAYER_WITH_ID_IN_GAME, { gameId: "123", playerId: "456" });

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 500,
        message: `Unexpected exception in werewolvesEat`,
        error: `Can't find player with id "456" for game with id "123"`,
      });
    });
  });
});