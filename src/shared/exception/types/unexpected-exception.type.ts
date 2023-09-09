import { InternalServerErrorException } from "@nestjs/common";
import { template } from "radash";

import type { UnexpectedExceptionReasons } from "@/shared/exception/enums/unexpected-exception.enum";
import type { ExceptionInterpolations } from "@/shared/exception/types/exception.type";

class UnexpectedException extends InternalServerErrorException {
  public constructor(scope: string, reason: UnexpectedExceptionReasons, interpolations: ExceptionInterpolations = {}) {
    const message = `Unexpected exception in ${scope}`;
    super(message, { description: template(reason, interpolations) });
  }
}

export { UnexpectedException };