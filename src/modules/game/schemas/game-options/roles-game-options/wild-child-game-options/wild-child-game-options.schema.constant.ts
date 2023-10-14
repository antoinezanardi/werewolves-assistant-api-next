import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { WildChildGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/wild-child-game-options/wild-child-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS = {
  isTransformationRevealed: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.wildChild.isTransformationRevealed,
  },
} as const satisfies Record<keyof WildChildGameOptions, MongoosePropOptions>;

const WILD_CHILD_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof WildChildGameOptions, ApiPropertyOptions>> = {
  isTransformationRevealed: {
    description: "If set to `true`, when `wild child` joins the `werewolves` side because his model died, the `game master` will announce his transformation to other players",
    ...convertMongoosePropOptionsToApiPropertyOptions(WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS.isTransformationRevealed),
  },
};

export {
  WILD_CHILD_GAME_OPTIONS_API_PROPERTIES,
  WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS,
};