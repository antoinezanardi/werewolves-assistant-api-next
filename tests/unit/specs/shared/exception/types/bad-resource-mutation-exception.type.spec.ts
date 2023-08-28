import { ApiResources } from "@/shared/api/enums/api.enum";
import { BadResourceMutationReasons } from "@/shared/exception/enums/bad-resource-mutation-error.enum";
import { BadResourceMutationException } from "@/shared/exception/types/bad-resource-mutation-exception.type";

import type { ExceptionResponse } from "@tests/types/exception/exception.types";

describe("Resource not found mutation exception type", () => {
  describe("getResponse", () => {
    it("should get response without description when called without reason.", () => {
      const id = "123";
      const exception = new BadResourceMutationException(ApiResources.GAMES, id);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 400,
        message: `Bad mutation for Game with id "${id}"`,
        error: undefined,
      });
    });

    it("should get response with description when called with reason.", () => {
      const id = "123";
      const exception = new BadResourceMutationException(ApiResources.GAMES, id, BadResourceMutationReasons.GAME_NOT_PLAYING);

      expect(exception.getResponse()).toStrictEqual<ExceptionResponse>({
        statusCode: 400,
        message: `Bad mutation for Game with id "${id}"`,
        error: `Game doesn't have status with value "playing"`,
      });
    });
  });
});