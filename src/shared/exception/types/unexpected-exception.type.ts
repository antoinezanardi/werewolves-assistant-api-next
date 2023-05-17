import { InternalServerErrorException } from "@nestjs/common";
import { template } from "radash";
import type { UNEXPECTED_EXCEPTION_REASONS, UNEXPECTED_EXCEPTION_SCOPES } from "../enums/unexpected-exception.enum";
import type { ExceptionInterpolations } from "./exception.type";

class UnexpectedException extends InternalServerErrorException {
  public constructor(scope: UNEXPECTED_EXCEPTION_SCOPES, reason: UNEXPECTED_EXCEPTION_REASONS, interpolations: ExceptionInterpolations = {}) {
    const message = `Unexpected exception in ${scope}`;
    super(message, { description: template(reason, interpolations) });
  }
}

export { UnexpectedException };