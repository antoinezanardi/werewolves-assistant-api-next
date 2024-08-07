import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import type { CupidGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/cupid-game-options/cupid-game-options.schema";
import { CUPID_LOVERS_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/cupid-game-options/cupid-lovers-game-options/cupid-game-options.schema";
import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const CUPID_GAME_OPTIONS_FIELDS_SPECS = {
  lovers: {
    required: true,
    type: CUPID_LOVERS_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.cupid.lovers,
  },
  mustWinWithLovers: {
    required: false,
    default: DEFAULT_GAME_OPTIONS.roles.cupid.mustWinWithLovers,
  },
} as const satisfies Record<keyof CupidGameOptions, MongoosePropOptions>;

const CUPID_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof CupidGameOptions, ApiPropertyOptions>> = {
  lovers: {
    description: "Game lovers from `cupid` role options.",
    ...convertMongoosePropOptionsToApiPropertyOptions(CUPID_GAME_OPTIONS_FIELDS_SPECS.lovers),
  },
  mustWinWithLovers: {
    description: "If set to `true`, cupid teams up with the lovers he chooses. Thus, if the lovers and him are the only ones left alive, they win the game together.",
    ...convertMongoosePropOptionsToApiPropertyOptions(CUPID_GAME_OPTIONS_FIELDS_SPECS.mustWinWithLovers),
  },
};

export {
  CUPID_GAME_OPTIONS_API_PROPERTIES,
  CUPID_GAME_OPTIONS_FIELDS_SPECS,
};