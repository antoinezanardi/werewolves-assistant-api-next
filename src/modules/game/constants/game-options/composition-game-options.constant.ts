import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { CompositionGameOptions } from "../../schemas/game-options/composition-game-options.schema";
import { defaultGameOptions } from "./game-options.constant";

const compositionGameOptionsFieldsSpecs = Object.freeze({ isHidden: { default: defaultGameOptions.composition.isHidden } });

const compositionGameOptionsApiProperties: Record<keyof CompositionGameOptions, ApiPropertyOptions> = Object.freeze({
  isHidden: {
    description: "If set to `true`, game's composition will be hidden to all players",
    ...compositionGameOptionsFieldsSpecs.isHidden,
  },
});

export { compositionGameOptionsApiProperties, compositionGameOptionsFieldsSpecs };