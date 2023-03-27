import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { PlayerRole } from "../../schemas/player/player-role.schema";

const playerRoleApiProperties: Record<keyof PlayerRole, ApiPropertyOptions> = Object.freeze({
  original: { description: "Player's original role when the game started" },
  current: { description: "Player's current role" },
  isRevealed: { description: "If player's role is revealed to other players" },
});

export { playerRoleApiProperties };