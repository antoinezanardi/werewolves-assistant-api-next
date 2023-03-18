import { BadRequestException, NotFoundException } from "@nestjs/common";
import { API_RESOURCES } from "../../../../../../src/shared/api/enums/api.enum";
import { BAD_RESOURCE_MUTATION_REASONS } from "../../../../../../src/shared/error/enums/bad-resource-mutation-error.enum";
import { getBadResourceMutationReasonMessage, getControllerRouteError } from "../../../../../../src/shared/error/helpers/error.helper";
import { BadResourceMutationError } from "../../../../../../src/shared/error/types/bad-resource-mutation-error.type";
import { ResourceNotFoundError } from "../../../../../../src/shared/error/types/resource-not-found-error.type";

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

    it("should return a BadRequestException when error is BadResourceMutationError.", () => {
      const id = "123";
      const error = new BadResourceMutationError(API_RESOURCES.GAMES, id, BAD_RESOURCE_MUTATION_REASONS.GAME_NOT_PLAYING);
      const result = getControllerRouteError(error);
      expect(result instanceof BadRequestException).toBe(true);
      expect((result as BadRequestException).message).toBe(`Bad mutation for Game with id "${id}" : Game doesn't have status with value "playing"`);
    });
  });

  describe("getBadResourceMutationReasonMessage", () => {
    it.each<{ reason: BAD_RESOURCE_MUTATION_REASONS; message: string }>([{ reason: BAD_RESOURCE_MUTATION_REASONS.GAME_NOT_PLAYING, message: `Game doesn't have status with value "playing"` }])("should return message $message when reason is $reason [#$#].", ({ reason, message }) => {
      expect(getBadResourceMutationReasonMessage(reason)).toBe(message);
    });
  });
});