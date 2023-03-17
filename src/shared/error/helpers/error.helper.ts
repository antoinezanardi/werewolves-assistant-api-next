import { NotFoundException } from "@nestjs/common";
import { ResourceNotFoundError } from "../types/error.type";

function getControllerRouteError(err: unknown): unknown {
  if (err instanceof ResourceNotFoundError) {
    return new NotFoundException(err.message);
  }
  return err;
}

export { getControllerRouteError };