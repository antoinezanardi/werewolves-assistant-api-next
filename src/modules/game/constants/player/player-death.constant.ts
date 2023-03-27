import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { PlayerDeath } from "../../schemas/player/player-death.schema";
import { gameSourceValues } from "../game.constant";

const playerDeathApiProperties: Record<keyof PlayerDeath, ApiPropertyOptions> = Object.freeze({
  source: {
    description: "Which entity killed the player",
    enum: gameSourceValues,
  },
  cause: { description: "Death's cause of the player" },
});

export { playerDeathApiProperties };