import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { PlayerSide } from "../schemas/player-side.schema";

const playerSideApiProperties: Record<keyof PlayerSide, ApiPropertyOptions> = Object.freeze({
  original: { description: "Player's original side when the game started" },
  current: { description: "Player's current side" },
});

export { playerSideApiProperties };