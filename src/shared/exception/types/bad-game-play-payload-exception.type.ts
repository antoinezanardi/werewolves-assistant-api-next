import { BadRequestException } from "@nestjs/common";
import type { BAD_GAME_PLAY_PAYLOAD_REASONS } from "../enums/bad-game-play-payload-error.enum";

class BadGamePlayPayloadException extends BadRequestException {
  public constructor(reason: BAD_GAME_PLAY_PAYLOAD_REASONS) {
    const message = `Bad game play payload`;
    super(message, { description: reason });
  }
}

export { BadGamePlayPayloadException };