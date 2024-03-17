import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { IdiotGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/idiot-game-options/idiot-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const IDIOT_GAME_OPTIONS_FIELDS_SPECS = {
  doesDieOnElderDeath: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.idiot.doesDieOnElderDeath,
  },
} as const satisfies Record<keyof IdiotGameOptions, MongoosePropOptions>;

const IDIOT_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof IdiotGameOptions, ApiPropertyOptions>> = {
  doesDieOnElderDeath: {
    description: "If set to `true`, the idiot will die if his role is revealed and the elder just died",
    ...convertMongoosePropOptionsToApiPropertyOptions(IDIOT_GAME_OPTIONS_FIELDS_SPECS.doesDieOnElderDeath),
  },
};

export {
  IDIOT_GAME_OPTIONS_API_PROPERTIES,
  IDIOT_GAME_OPTIONS_FIELDS_SPECS,
};