import type { ApiPropertyOptions } from "@nestjs/swagger";

import type { PlayerRole } from "@/modules/game/schemas/player/player-role.schema";

const PLAYER_ROLE_API_PROPERTIES: Record<keyof PlayerRole, ApiPropertyOptions> = Object.freeze({
  original: { description: "Player's original role when the game started" },
  current: { description: "Player's current role" },
  isRevealed: { description: "If player's role is revealed to other players" },
});

export { PLAYER_ROLE_API_PROPERTIES };