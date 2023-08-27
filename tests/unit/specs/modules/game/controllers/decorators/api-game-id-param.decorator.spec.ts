import * as NestSwagger from "@nestjs/swagger";

import { ApiGameIdParam } from "@/modules/game/controllers/decorators/api-game-id-param.decorator";

describe("Api Game Id Param Decorator", () => {
  let mocks: { nestSwagger: { ApiParam: jest.SpyInstance } };

  beforeEach(() => {
    mocks = { nestSwagger: { ApiParam: jest.spyOn(NestSwagger, "ApiParam").mockImplementation() } };
  });

  describe("ApiGameIdParam", () => {
    const defaultOptions: NestSwagger.ApiParamOptions = {
      name: "id",
      description: "Game's Id. Must be a valid Mongo ObjectId",
      example: "507f1f77bcf86cd799439011",
    };

    it("should call api param function with default values when called without specific options.", () => {
      ApiGameIdParam();

      expect(mocks.nestSwagger.ApiParam).toHaveBeenCalledExactlyOnceWith(defaultOptions);
    });

    it("should call api param function with other values when called with specific options.", () => {
      ApiGameIdParam({ name: "lol" });

      expect(mocks.nestSwagger.ApiParam).toHaveBeenCalledExactlyOnceWith({ ...defaultOptions, name: "lol" });
    });
  });
});