import type { ApiResponseOptions } from "@nestjs/swagger";
import * as NestSwagger from "@nestjs/swagger";
import { ApiGameNotFoundResponse } from "../../../../../../../src/modules/game/controllers/decorators/api-game-not-found-response.decorator";

describe("Api Game Not Found Response Decorator", () => {
  describe("ApiGameNotFoundResponse", () => {
    const defaultOptions: ApiResponseOptions = { description: "The game with the provided id doesn't exist in database" };

    it("should call api not found response function with default values when called without specific options.", () => {
      const ApiNotFoundResponseMock = jest.spyOn(NestSwagger, "ApiNotFoundResponse").mockImplementation();

      ApiGameNotFoundResponse();
      expect(ApiNotFoundResponseMock).toHaveBeenCalledOnceWith(defaultOptions);
    });

    it("should call api not found response function with other values when called with specific options.", () => {
      const ApiNotFoundResponseMock = jest.spyOn(NestSwagger, "ApiNotFoundResponse").mockImplementation();

      ApiGameNotFoundResponse({ description: "lol" });
      expect(ApiNotFoundResponseMock).toHaveBeenCalledOnceWith({ ...defaultOptions, description: "lol" });
    });
  });
});