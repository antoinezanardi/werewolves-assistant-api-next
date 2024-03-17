import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { DefenderGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/defender-game-options/defender-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const DEFENDER_GAME_OPTIONS_FIELDS_SPECS = {
  canProtectTwice: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.defender.canProtectTwice,
  },
} as const satisfies Record<keyof DefenderGameOptions, MongoosePropOptions>;

const DEFENDER_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof DefenderGameOptions, ApiPropertyOptions>> = {
  canProtectTwice: {
    description: "If set to `true`, the defender can protect twice in a row the same target",
    ...convertMongoosePropOptionsToApiPropertyOptions(DEFENDER_GAME_OPTIONS_FIELDS_SPECS.canProtectTwice),
  },
};

export {
  DEFENDER_GAME_OPTIONS_API_PROPERTIES,
  DEFENDER_GAME_OPTIONS_FIELDS_SPECS,
};