import { BAD_GAME_PLAY_PAYLOAD_REASONS } from "../../../../../../src/shared/exception/enums/bad-game-play-payload-error.enum";
import { BadGamePlayPayloadException } from "../../../../../../src/shared/exception/types/bad-game-play-payload-exception.type";
import type { ExceptionResponse } from "../../../../../types/exception/exception.types";

describe("Bad game play payload exception type", () => {
  describe("getResponse", () => {
    it("should get response when called.", () => {
      const exception = new BadGamePlayPayloadException(BAD_GAME_PLAY_PAYLOAD_REASONS.TOO_MUCH_TARGETS);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 400,
        message: `Bad game play payload`,
        error: `There are too much targets for this current game's state`,
      });
    });
  });
});