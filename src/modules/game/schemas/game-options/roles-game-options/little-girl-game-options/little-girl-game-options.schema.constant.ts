import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { LittleGirlGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/little-girl-game-options/little-girl-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS = {
  isProtectedByDefender: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.littleGirl.isProtectedByDefender,
  },
} as const satisfies Record<keyof LittleGirlGameOptions, MongoosePropOptions>;

const LITTLE_GIRL_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof LittleGirlGameOptions, ApiPropertyOptions>> = {
  isProtectedByDefender: {
    description: "If set to `false`, the `little girl` won't be protected by the `defender` from the `werewolves` attacks",
    ...convertMongoosePropOptionsToApiPropertyOptions(LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS.isProtectedByDefender),
  },
};

export {
  LITTLE_GIRL_GAME_OPTIONS_API_PROPERTIES,
  LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS,
};