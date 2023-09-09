import type { ApiPropertyOptions } from "@nestjs/swagger";

import type { GameOptions } from "@/modules/game/schemas/game-options/game-options.schema";

const GAME_OPTIONS_API_PROPERTIES: Record<keyof GameOptions, ApiPropertyOptions> = Object.freeze({
  composition: { description: "Game's composition options" },
  votes: { description: "Game's votes options" },
  roles: { description: "Game's roles options" },
});

export { GAME_OPTIONS_API_PROPERTIES };