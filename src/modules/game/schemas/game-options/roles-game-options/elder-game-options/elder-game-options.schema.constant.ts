import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { ElderGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/elder-game-options/elder-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const ELDER_GAME_OPTIONS_FIELDS_SPECS = {
  livesCountAgainstWerewolves: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.elder.livesCountAgainstWerewolves,
    min: 1,
    max: 5,
  },
  doesTakeHisRevenge: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.elder.doesTakeHisRevenge,
  },
} as const satisfies Record<keyof ElderGameOptions, MongoosePropOptions>;

const ELDER_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof ElderGameOptions, ApiPropertyOptions>> = {
  livesCountAgainstWerewolves: {
    description: "Number of lives `elder` has against `werewolves`",
    ...convertMongoosePropOptionsToApiPropertyOptions(ELDER_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves),
  },
  doesTakeHisRevenge: {
    description: "If set to `true`, the elder will make all players from the villagers side powerless if he dies from them",
    ...convertMongoosePropOptionsToApiPropertyOptions(ELDER_GAME_OPTIONS_FIELDS_SPECS.doesTakeHisRevenge),
  },
};

export {
  ELDER_GAME_OPTIONS_API_PROPERTIES,
  ELDER_GAME_OPTIONS_FIELDS_SPECS,
};