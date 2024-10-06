import { BadGamePlayPayloadReasons } from "@/shared/exception/enums/bad-game-play-payload-error.enums";
import { BadGamePlayPayloadException } from "@/shared/exception/types/bad-game-play-payload-exception.types";

import type { ExceptionResponse } from "@tests/types/exception/exception.types";

describe("Bad game play payload exception type", () => {
  describe("getResponse", () => {
    it("should get response when called.", () => {
      const exception = new BadGamePlayPayloadException(BadGamePlayPayloadReasons.TOO_MUCH_TARGETS);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 400,
        message: `Bad game play payload`,
        error: `There are too much targets for this current game's state`,
      });
    });
  });
});