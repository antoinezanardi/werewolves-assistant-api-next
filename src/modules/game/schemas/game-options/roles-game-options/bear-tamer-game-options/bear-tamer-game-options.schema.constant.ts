import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { BearTamerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/bear-tamer-game-options/bear-tamer-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS = {
  doesGrowlOnWerewolvesSide: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.bearTamer.doesGrowlOnWerewolvesSide,
  },
} as const satisfies Record<keyof BearTamerGameOptions, MongoosePropOptions>;

const BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof BearTamerGameOptions, ApiPropertyOptions>> = {
  doesGrowlOnWerewolvesSide: {
    description: "If set to `true`, the bear tamer will have the `growls` attribute until he dies if he is on the werewolves side.",
    ...convertMongoosePropOptionsToApiPropertyOptions(BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS.doesGrowlOnWerewolvesSide),
  },
};

export {
  BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES,
  BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS,
};