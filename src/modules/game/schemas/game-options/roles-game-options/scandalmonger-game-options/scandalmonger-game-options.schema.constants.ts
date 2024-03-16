import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { ScandalmongerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/scandalmonger-game-options/scandalmonger-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const SCANDALMONGER_GAME_OPTIONS_FIELDS_SPECS = {
  markPenalty: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.scandalmonger.markPenalty,
    min: 1,
    max: 5,
  },
} as const satisfies Record<keyof ScandalmongerGameOptions, MongoosePropOptions>;

const SCANDALMONGER_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof ScandalmongerGameOptions, ApiPropertyOptions>> = {
  markPenalty: {
    description: "Penalty of votes against the player targeted by the `scandalmonger mark` for the next village's vote. In other words, the `scandalmonger marked` player will have two votes against himself if this value is set to `2`",
    ...convertMongoosePropOptionsToApiPropertyOptions(SCANDALMONGER_GAME_OPTIONS_FIELDS_SPECS.markPenalty),
  },
};

export {
  SCANDALMONGER_GAME_OPTIONS_API_PROPERTIES,
  SCANDALMONGER_GAME_OPTIONS_FIELDS_SPECS,
};