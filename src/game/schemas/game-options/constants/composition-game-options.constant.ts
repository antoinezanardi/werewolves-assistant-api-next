import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { CompositionGameOptions } from "../schemas/composition-game-options.schema";
import { defaultGameOptions } from "./game-options.constant";

const compositionGameOptionsApiProperties: Record<keyof CompositionGameOptions, ApiPropertyOptions> = Object.freeze({
  isHidden: {
    description: "If set to `true`, game's composition will be hidden to all players",
    default: defaultGameOptions.composition.isHidden,
  },
});

export { compositionGameOptionsApiProperties };