import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { WildChildGameOptions } from "../../schemas/roles-game-options/wild-child-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const wildChildGameOptionsFieldsSpecs = Object.freeze({ isTransformationRevealed: { default: defaultGameOptions.roles.wildChild.isTransformationRevealed } });

const wildChildGameOptionsApiProperties: Record<keyof WildChildGameOptions, ApiPropertyOptions> = Object.freeze({
  isTransformationRevealed: {
    description: "If set to `true`, when `wild child` joins the `werewolves` side because his model died, the `game master` will announce his transformation to other players",
    ...wildChildGameOptionsFieldsSpecs.isTransformationRevealed,
  },
});

export { wildChildGameOptionsApiProperties, wildChildGameOptionsFieldsSpecs };