import { BadRequestException, NotFoundException } from "@nestjs/common";
import { BadResourceMutationError } from "../types/bad-resource-mutation-error.type";
import { ResourceNotFoundError } from "../types/resource-not-found-error.type";

function getControllerRouteError(err: unknown): unknown {
  if (err instanceof ResourceNotFoundError) {
    return new NotFoundException(err.message);
  } else if (err instanceof BadResourceMutationError) {
    return new BadRequestException(err.message);
  }
  return err;
}

export { getControllerRouteError };