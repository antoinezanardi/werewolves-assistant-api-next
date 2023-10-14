import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { RavenGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/raven-game-options/raven-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const RAVEN_GAME_OPTIONS_FIELDS_SPECS = {
  markPenalty: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.raven.markPenalty,
    min: 1,
    max: 5,
  },
} as const satisfies Record<keyof RavenGameOptions, MongoosePropOptions>;

const RAVEN_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof RavenGameOptions, ApiPropertyOptions>> = {
  markPenalty: {
    description: "Penalty of votes against the player targeted by the `raven mark` for the next village's vote. In other words, the `raven marked` player will have two votes against himself if this value is set to `2`",
    ...convertMongoosePropOptionsToApiPropertyOptions(RAVEN_GAME_OPTIONS_FIELDS_SPECS.markPenalty),
  },
};

export {
  RAVEN_GAME_OPTIONS_API_PROPERTIES,
  RAVEN_GAME_OPTIONS_FIELDS_SPECS,
};