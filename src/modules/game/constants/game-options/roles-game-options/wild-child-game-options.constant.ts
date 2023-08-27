
import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { WildChildGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/wild-child-game-options.schema";

const wildChildGameOptionsFieldsSpecs = Object.freeze({ isTransformationRevealed: { default: defaultGameOptions.roles.wildChild.isTransformationRevealed } });

const wildChildGameOptionsApiProperties: Record<keyof WildChildGameOptions, ApiPropertyOptions> = Object.freeze({
  isTransformationRevealed: {
    description: "If set to `true`, when `wild child` joins the `werewolves` side because his model died, the `game master` will announce his transformation to other players",
    ...wildChildGameOptionsFieldsSpecs.isTransformationRevealed,
  },
});

export { wildChildGameOptionsApiProperties, wildChildGameOptionsFieldsSpecs };