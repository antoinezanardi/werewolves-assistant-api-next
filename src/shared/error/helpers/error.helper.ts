import { BadRequestException, NotFoundException } from "@nestjs/common";
import { BAD_RESOURCE_MUTATION_REASONS } from "../enums/bad-resource-mutation-error.enum";
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

function getBadResourceMutationReasonMessage(reason: BAD_RESOURCE_MUTATION_REASONS): string {
  const reasonMessages: Record<BAD_RESOURCE_MUTATION_REASONS, string> = { [BAD_RESOURCE_MUTATION_REASONS.GAME_NOT_PLAYING]: `Game doesn't have status with value "playing"` };
  return reasonMessages[reason];
}

export { getControllerRouteError, getBadResourceMutationReasonMessage };