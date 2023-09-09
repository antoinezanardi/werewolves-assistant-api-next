import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { LittleGirlGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/little-girl-game-options/little-girl-game-options.schema";

const LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS = Object.freeze({ isProtectedByGuard: { default: DEFAULT_GAME_OPTIONS.roles.littleGirl.isProtectedByGuard } });

const LITTLE_GIRL_GAME_OPTIONS_API_PROPERTIES: Record<keyof LittleGirlGameOptions, ApiPropertyOptions> = Object.freeze({
  isProtectedByGuard: {
    description: "If set to `false`, the `little girl` won't be protected by the `guard` from the `werewolves` attacks",
    ...LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS.isProtectedByGuard,
  },
});

export {
  LITTLE_GIRL_GAME_OPTIONS_API_PROPERTIES,
  LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS,
};