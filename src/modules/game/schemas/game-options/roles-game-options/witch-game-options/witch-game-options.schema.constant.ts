import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import type { WitchGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/witch-game-options/witch-game-options.schema";
import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const WITCH_GAME_OPTIONS_FIELDS_SPECS = {
  doesKnowWerewolvesTargets: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.witch.doesKnowWerewolvesTargets,
  },
} as const satisfies Record<keyof WitchGameOptions, MongoosePropOptions>;

const WITCH_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof WitchGameOptions, ApiPropertyOptions>> = {
  doesKnowWerewolvesTargets: {
    description: "If set to `true`, the game master will point out the werewolves' targets to the witch to know which one she can save with her life potion.",
    ...convertMongoosePropOptionsToApiPropertyOptions(WITCH_GAME_OPTIONS_FIELDS_SPECS.doesKnowWerewolvesTargets),
  },
};

export {
  WITCH_GAME_OPTIONS_API_PROPERTIES,
  WITCH_GAME_OPTIONS_FIELDS_SPECS,
};