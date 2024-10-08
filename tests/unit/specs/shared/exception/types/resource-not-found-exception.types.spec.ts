import { ApiResources } from "@/shared/api/enums/api.enums";
import { ResourceNotFoundReasons } from "@/shared/exception/enums/resource-not-found-error.enums";
import { ResourceNotFoundException } from "@/shared/exception/types/resource-not-found-exception.types";

import type { ExceptionResponse } from "@tests/types/exception/exception.types";

describe("Resource not found exception type", () => {
  describe("getResponse", () => {
    it("should get response without description when called without reason.", () => {
      const id = "123";
      const exception = new ResourceNotFoundException(ApiResources.PLAYERS, id);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 404,
        message: `Player with id "${id}" not found`,
        error: undefined,
      });
    });

    it("should get response with description when called with reason.", () => {
      const id = "123";
      const exception = new ResourceNotFoundException(ApiResources.PLAYERS, id, ResourceNotFoundReasons.UNMATCHED_GAME_PLAY_PLAYER_VOTE_SOURCE);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 404,
        message: `Player with id "${id}" not found`,
        error: "Game Play - Player in `votes.source` is not in the game players",
      });
    });
  });
});