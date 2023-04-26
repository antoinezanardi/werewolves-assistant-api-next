import { BadRequestException, NotFoundException } from "@nestjs/common";
import { BadGamePlayPayloadError } from "../types/bad-game-play-payload-error.type";
import { BadResourceMutationError } from "../types/bad-resource-mutation-error.type";
import { ResourceNotFoundError } from "../types/resource-not-found-error.type";

function getControllerRouteError(err: unknown): unknown {
  if (err instanceof ResourceNotFoundError) {
    return new NotFoundException(err.message);
  } else if (err instanceof BadResourceMutationError || err instanceof BadGamePlayPayloadError) {
    return new BadRequestException(err.message);
  }
  return err;
}

export { getControllerRouteError };