import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { CompositionGameOptions } from "@/modules/game/schemas/game-options/composition-game-options/composition-game-options.schema";

const COMPOSITION_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({ isHidden: { default: DEFAULT_GAME_OPTIONS.composition.isHidden } });

const COMPOSITION_GAME_OPTIONS_API_PROPERTIES: Record<keyof CompositionGameOptions, ApiPropertyOptions> = Object.freeze({
  isHidden: {
    description: "If set to `true`, game's composition will be hidden to all players",
    ...COMPOSITION_GAME_OPTIONS_FIELDS_SPECS.isHidden,
  },
});

export {
  COMPOSITION_GAME_OPTIONS_API_PROPERTIES,
  COMPOSITION_GAME_OPTIONS_FIELDS_SPECS,
};