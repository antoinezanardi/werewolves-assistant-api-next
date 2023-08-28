import { BadRequestException } from "@nestjs/common";

import type { BadGamePlayPayloadReasons } from "@/shared/exception/enums/bad-game-play-payload-error.enum";

class BadGamePlayPayloadException extends BadRequestException {
  public constructor(reason: BadGamePlayPayloadReasons) {
    const message = `Bad game play payload`;
    super(message, { description: reason });
  }
}

export { BadGamePlayPayloadException };