
import type { ApiPropertyOptions } from "@nestjs/swagger";

import { gameSourceValues } from "@/modules/game/constants/game.constant";
import type { PlayerDeath } from "@/modules/game/schemas/player/player-death.schema";

const playerDeathApiProperties: Record<keyof PlayerDeath, ApiPropertyOptions> = Object.freeze({
  source: {
    description: "Which entity killed the player",
    enum: gameSourceValues,
  },
  cause: { description: "Death's cause of the player" },
});

export { playerDeathApiProperties };