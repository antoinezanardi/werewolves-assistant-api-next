import * as NestSwagger from "@nestjs/swagger";
import { ApiGameIdParam } from "../../../../../../../src/modules/game/controllers/decorators/api-game-id-param.decorator";

describe("Api Game Id Param Decorator", () => {
  describe("ApiGameIdParam", () => {
    const defaultOptions: NestSwagger.ApiParamOptions = {
      name: "id",
      description: "Game's Id. Must be a valid Mongo ObjectId",
      example: "507f1f77bcf86cd799439011",
    };

    it("should call api param function with default values when called without specific options.", () => {
      const ApiParamMock = jest.spyOn(NestSwagger, "ApiParam").mockImplementation();

      ApiGameIdParam();
      expect(ApiParamMock).toHaveBeenCalledOnceWith(defaultOptions);
    });

    it("should call api param function with other values when called with specific options.", () => {
      const ApiParamMock = jest.spyOn(NestSwagger, "ApiParam").mockImplementation();

      ApiGameIdParam({ name: "lol" });
      expect(ApiParamMock).toHaveBeenCalledOnceWith({ ...defaultOptions, name: "lol" });
    });
  });
});