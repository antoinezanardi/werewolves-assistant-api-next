import type { BAD_GAME_PLAY_PAYLOAD_REASONS } from "../enums/bad-game-play-payload-error.enum";

class BadGamePlayPayloadError extends Error {
  public constructor(reason: BAD_GAME_PLAY_PAYLOAD_REASONS) {
    const message = `Bad game play payload : ${reason}`;
    super(message);
  }
}

export { BadGamePlayPayloadError };