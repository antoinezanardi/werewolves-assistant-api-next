import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { WildChildGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/wild-child-game-options/wild-child-game-options.schema";

const WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({ isTransformationRevealed: { default: DEFAULT_GAME_OPTIONS.roles.wildChild.isTransformationRevealed } });

const WILD_CHILD_GAME_OPTIONS_API_PROPERTIES: Record<keyof WildChildGameOptions, ApiPropertyOptions> = Object.freeze({
  isTransformationRevealed: {
    description: "If set to `true`, when `wild child` joins the `werewolves` side because his model died, the `game master` will announce his transformation to other players",
    ...WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS.isTransformationRevealed,
  },
});

export {
  WILD_CHILD_GAME_OPTIONS_API_PROPERTIES,
  WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS,
};