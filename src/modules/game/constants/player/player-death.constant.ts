import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GAME_SOURCE_VALUES } from "@/modules/game/constants/game.constant";
import type { PlayerDeath } from "@/modules/game/schemas/player/player-death.schema";

const PLAYER_DEATH_API_PROPERTIES: Record<keyof PlayerDeath, ApiPropertyOptions> = Object.freeze({
  source: {
    description: "Which entity killed the player",
    enum: GAME_SOURCE_VALUES,
  },
  cause: { description: "Death's cause of the player" },
});

export { PLAYER_DEATH_API_PROPERTIES };