import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GamePlayActions } from "@/modules/game/enums/game-play.enum";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";

const GAME_PLAY_API_PROPERTIES: Readonly<Record<keyof GamePlay, ApiPropertyOptions>> = Object.freeze({
  source: { description: "Which role or group of people need to perform this action, with expected players to play" },
  action: {
    description: "What action need to be performed for this play",
    example: GamePlayActions.VOTE,
  },
  cause: { description: "Why this play needs to be performed" },
});

export { GAME_PLAY_API_PROPERTIES };