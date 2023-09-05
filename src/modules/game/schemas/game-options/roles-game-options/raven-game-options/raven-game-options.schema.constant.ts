import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { RavenGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/raven-game-options/raven-game-options.schema";

const RAVEN_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({
  markPenalty: {
    default: DEFAULT_GAME_OPTIONS.roles.raven.markPenalty,
    minimum: 1,
    maximum: 5,
  },
});

const RAVEN_GAME_OPTIONS_API_PROPERTIES: Record<keyof RavenGameOptions, ApiPropertyOptions> = Object.freeze({
  markPenalty: {
    description: "Penalty of votes against the player targeted by the `raven mark` for the next village's vote. In other words, the `raven marked` player will have two votes against himself if this value is set to `2`",
    ...RAVEN_GAME_OPTIONS_FIELDS_SPECS.markPenalty,
  },
});

export {
  RAVEN_GAME_OPTIONS_API_PROPERTIES,
  RAVEN_GAME_OPTIONS_FIELDS_SPECS,
};