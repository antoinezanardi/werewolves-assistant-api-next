import type { ApiPropertyOptions } from "@nestjs/swagger";

import type { PlayerSide } from "@/modules/game/schemas/player/player-side.schema";

const playerSideApiProperties: Readonly<Record<keyof PlayerSide, ApiPropertyOptions>> = Object.freeze({
  original: { description: "Player's original side when the game started" },
  current: { description: "Player's current side" },
});

export { playerSideApiProperties };