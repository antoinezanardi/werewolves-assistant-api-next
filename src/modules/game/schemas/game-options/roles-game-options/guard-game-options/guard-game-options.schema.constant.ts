import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { GuardGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/guard-game-options/guard-game-options.schema";

const GUARD_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({ canProtectTwice: { default: DEFAULT_GAME_OPTIONS.roles.guard.canProtectTwice } });

const GUARD_GAME_OPTIONS_API_PROPERTIES: Record<keyof GuardGameOptions, ApiPropertyOptions> = Object.freeze({
  canProtectTwice: {
    description: "If set to `true`, the guard can protect twice in a row the same target",
    ...GUARD_GAME_OPTIONS_FIELDS_SPECS.canProtectTwice,
  },
});

export {
  GUARD_GAME_OPTIONS_API_PROPERTIES,
  GUARD_GAME_OPTIONS_FIELDS_SPECS,
};