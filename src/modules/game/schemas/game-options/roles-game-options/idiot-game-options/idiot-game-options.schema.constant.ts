import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { IdiotGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/idiot-game-options/idiot-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const IDIOT_GAME_OPTIONS_FIELDS_SPECS = {
  doesDieOnAncientDeath: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.idiot.doesDieOnAncientDeath,
  },
} as const satisfies Record<keyof IdiotGameOptions, MongoosePropOptions>;

const IDIOT_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof IdiotGameOptions, ApiPropertyOptions>> = {
  doesDieOnAncientDeath: {
    description: "If set to `true`, the idiot will die if his role is revealed and the ancient just died",
    ...convertMongoosePropOptionsToApiPropertyOptions(IDIOT_GAME_OPTIONS_FIELDS_SPECS.doesDieOnAncientDeath),
  },
};

export {
  IDIOT_GAME_OPTIONS_API_PROPERTIES,
  IDIOT_GAME_OPTIONS_FIELDS_SPECS,
};