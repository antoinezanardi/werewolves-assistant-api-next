import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { AncientGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/ancient-game-options/ancient-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const ANCIENT_GAME_OPTIONS_FIELDS_SPECS = {
  livesCountAgainstWerewolves: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.ancient.livesCountAgainstWerewolves,
    min: 1,
    max: 5,
  },
  doesTakeHisRevenge: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.ancient.doesTakeHisRevenge,
  },
} as const satisfies Record<keyof AncientGameOptions, MongoosePropOptions>;

const ANCIENT_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof AncientGameOptions, ApiPropertyOptions>> = {
  livesCountAgainstWerewolves: {
    description: "Number of lives `ancient` has against `werewolves`",
    ...convertMongoosePropOptionsToApiPropertyOptions(ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves),
  },
  doesTakeHisRevenge: {
    description: "If set to `true`, the ancient will make all players from the villagers side powerless if he dies from them",
    ...convertMongoosePropOptionsToApiPropertyOptions(ANCIENT_GAME_OPTIONS_FIELDS_SPECS.doesTakeHisRevenge),
  },
};

export {
  ANCIENT_GAME_OPTIONS_API_PROPERTIES,
  ANCIENT_GAME_OPTIONS_FIELDS_SPECS,
};