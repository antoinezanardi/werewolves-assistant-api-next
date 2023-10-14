import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { GuardGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/guard-game-options/guard-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GUARD_GAME_OPTIONS_FIELDS_SPECS = {
  canProtectTwice: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.guard.canProtectTwice,
  },
} as const satisfies Record<keyof GuardGameOptions, MongoosePropOptions>;

const GUARD_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof GuardGameOptions, ApiPropertyOptions>> = {
  canProtectTwice: {
    description: "If set to `true`, the guard can protect twice in a row the same target",
    ...convertMongoosePropOptionsToApiPropertyOptions(GUARD_GAME_OPTIONS_FIELDS_SPECS.canProtectTwice),
  },
};

export {
  GUARD_GAME_OPTIONS_API_PROPERTIES,
  GUARD_GAME_OPTIONS_FIELDS_SPECS,
};