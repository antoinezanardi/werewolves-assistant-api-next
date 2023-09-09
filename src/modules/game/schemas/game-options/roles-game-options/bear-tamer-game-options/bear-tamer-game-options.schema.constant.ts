import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { BearTamerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/bear-tamer-game-options/bear-tamer-game-options.schema";

const BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({ doesGrowlIfInfected: { default: DEFAULT_GAME_OPTIONS.roles.bearTamer.doesGrowlIfInfected } });

const BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES: Record<keyof BearTamerGameOptions, ApiPropertyOptions> = Object.freeze({
  doesGrowlIfInfected: {
    description: "If set to `true`, the bear tamer will have the `growls` attribute until he dies if he is `infected`",
    ...BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS.doesGrowlIfInfected,
  },
});

export {
  BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES,
  BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS,
};