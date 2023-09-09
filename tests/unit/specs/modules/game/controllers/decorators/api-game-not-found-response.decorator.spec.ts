import * as NestSwagger from "@nestjs/swagger";
import type { ApiResponseOptions } from "@nestjs/swagger";

import { ApiGameNotFoundResponse } from "@/modules/game/controllers/decorators/api-game-not-found-response.decorator";

describe("Api Game Not Found Response Decorator", () => {
  let mocks: { nestSwagger: { ApiNotFoundResponse: jest.SpyInstance } };

  beforeEach(() => {
    mocks = { nestSwagger: { ApiNotFoundResponse: jest.spyOn(NestSwagger, "ApiNotFoundResponse").mockImplementation() } };
  });

  describe("ApiGameNotFoundResponse", () => {
    const defaultOptions: ApiResponseOptions = { description: "The game with the provided id doesn't exist in database" };

    it("should call api not found response function with default values when called without specific options.", () => {
      ApiGameNotFoundResponse();

      expect(mocks.nestSwagger.ApiNotFoundResponse).toHaveBeenCalledExactlyOnceWith(defaultOptions);
    });

    it("should call api not found response function with other values when called with specific options.", () => {
      ApiGameNotFoundResponse({ description: "lol" });

      expect(mocks.nestSwagger.ApiNotFoundResponse).toHaveBeenCalledExactlyOnceWith({ ...defaultOptions, description: "lol" });
    });
  });
});