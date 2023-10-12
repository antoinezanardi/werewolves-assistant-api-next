import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { CompositionGameOptions } from "@/modules/game/schemas/game-options/composition-game-options/composition-game-options.schema";

import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const COMPOSITION_GAME_OPTIONS_FIELDS_SPECS: ReadonlyDeep<Record<keyof CompositionGameOptions, MongoosePropOptions>> = { isHidden: { default: DEFAULT_GAME_OPTIONS.composition.isHidden } };

const COMPOSITION_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof CompositionGameOptions, ApiPropertyOptions>> = {
  isHidden: {
    description: "If set to `true`, game's composition will be hidden to all players",
    ...COMPOSITION_GAME_OPTIONS_FIELDS_SPECS.isHidden as ApiPropertyOptions,
  },
};

export {
  COMPOSITION_GAME_OPTIONS_API_PROPERTIES,
  COMPOSITION_GAME_OPTIONS_FIELDS_SPECS,
};