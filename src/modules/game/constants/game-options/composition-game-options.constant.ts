import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { CompositionGameOptions } from "@/modules/game/schemas/game-options/composition-game-options.schema";

const compositionGameOptionsFieldsSpecs = Object.freeze({ isHidden: { default: defaultGameOptions.composition.isHidden } });

const compositionGameOptionsApiProperties: Record<keyof CompositionGameOptions, ApiPropertyOptions> = Object.freeze({
  isHidden: {
    description: "If set to `true`, game's composition will be hidden to all players",
    ...compositionGameOptionsFieldsSpecs.isHidden,
  },
});

export { compositionGameOptionsApiProperties, compositionGameOptionsFieldsSpecs };