import { API_RESOURCES } from "../../../../../../src/shared/api/enums/api.enum";
import { RESOURCE_NOT_FOUND_REASONS } from "../../../../../../src/shared/exception/enums/resource-not-found-error.enum";
import { ResourceNotFoundException } from "../../../../../../src/shared/exception/types/resource-not-found-exception.type";
import type { ExceptionResponse } from "../../../../../types/exception/exception.types";

describe("Resource not found exception type", () => {
  describe("getResponse", () => {
    it("should get response without description when called without reason.", () => {
      const id = "123";
      const exception = new ResourceNotFoundException(API_RESOURCES.PLAYERS, id);
      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 404,
        message: `Player with id "${id}" not found`,
        error: undefined,
      });
    });

    it("should get response with description when called with reason.", () => {
      const id = "123";
      const exception = new ResourceNotFoundException(API_RESOURCES.PLAYERS, id, RESOURCE_NOT_FOUND_REASONS.UNMATCHED_GAME_PLAY_PLAYER_VOTE_SOURCE);
      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 404,
        message: `Player with id "${id}" not found`,
        error: "Game Play - Player in `votes.source` is not in the game players",
      });
    });
  });
});