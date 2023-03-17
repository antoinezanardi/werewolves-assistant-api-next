import { NotFoundException } from "@nestjs/common";
import { API_RESOURCES } from "../../../../../../src/shared/api/enums/api.enum";
import { getControllerRouteError } from "../../../../../../src/shared/error/helpers/error.helper";
import { ResourceNotFoundError } from "../../../../../../src/shared/error/types/error.type";

describe("Error Helper", () => {
  describe("getControllerRouteError", () => {
    it("should return the error as is when it doesn't have to be transformed.", () => {
      const error = new Error("123");
      expect(getControllerRouteError(error)).toStrictEqual(error);
    });

    it("should return a NotFoundExceptionError when error is ResourceNotFoundError.", () => {
      const id = "123";
      const error = new ResourceNotFoundError(API_RESOURCES.GAMES, id);
      const result = getControllerRouteError(error);
      expect(result instanceof NotFoundException).toBe(true);
      expect((result as NotFoundException).message).toBe(`Game with id "${id}" not found`);
    });
  });
});