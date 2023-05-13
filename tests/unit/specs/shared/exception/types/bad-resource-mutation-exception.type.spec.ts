import { API_RESOURCES } from "../../../../../../src/shared/api/enums/api.enum";
import { BAD_RESOURCE_MUTATION_REASONS } from "../../../../../../src/shared/exception/enums/bad-resource-mutation-error.enum";
import { BadResourceMutationException } from "../../../../../../src/shared/exception/types/bad-resource-mutation-exception.type";
import type { ExceptionResponse } from "../../../../../types/exception/exception.types";

describe("Resource not found mutation exception type", () => {
  describe("getResponse", () => {
    it("should get response without description when called without reason.", () => {
      const id = "123";
      const exception = new BadResourceMutationException(API_RESOURCES.GAMES, id);
      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 400,
        message: `Bad mutation for Game with id "${id}"`,
        error: undefined,
      });
    });

    it("should get response with description when called with reason.", () => {
      const id = "123";
      const exception = new BadResourceMutationException(API_RESOURCES.GAMES, id, BAD_RESOURCE_MUTATION_REASONS.GAME_NOT_PLAYING);
      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 400,
        message: `Bad mutation for Game with id "${id}"`,
        error: `Game doesn't have status with value "playing"`,
      });
    });
  });
});