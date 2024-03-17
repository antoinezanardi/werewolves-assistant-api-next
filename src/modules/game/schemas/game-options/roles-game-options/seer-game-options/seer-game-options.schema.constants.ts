import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { SeerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/seer-game-options/seer-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const SEER_GAME_OPTIONS_FIELDS_SPECS = {
  isTalkative: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.seer.isTalkative,
  },
  canSeeRoles: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.seer.canSeeRoles,
  },
} as const satisfies Record<keyof SeerGameOptions, MongoosePropOptions>;

const SEER_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof SeerGameOptions, ApiPropertyOptions>> = {
  isTalkative: {
    description: "If set to `true`, the game master must say out loud what the `seer` saw during her night, otherwise, he must mime the seen role to the `seer`",
    ...convertMongoosePropOptionsToApiPropertyOptions(SEER_GAME_OPTIONS_FIELDS_SPECS.isTalkative),
  },
  canSeeRoles: {
    description: "If set to `true`, the seer can see the exact `role` of the target, otherwise, she only sees the `side`",
    ...convertMongoosePropOptionsToApiPropertyOptions(SEER_GAME_OPTIONS_FIELDS_SPECS.canSeeRoles),
  },
};

export {
  SEER_GAME_OPTIONS_API_PROPERTIES,
  SEER_GAME_OPTIONS_FIELDS_SPECS,
};