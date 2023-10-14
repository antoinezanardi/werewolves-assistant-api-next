import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { TwoSistersGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/two-sisters-game-options/two-sisters-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS = {
  wakingUpInterval: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.twoSisters.wakingUpInterval,
    min: 0,
    max: 5,
  },
} as const satisfies Record<keyof TwoSistersGameOptions, MongoosePropOptions>;

const TWO_SISTERS_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof TwoSistersGameOptions, ApiPropertyOptions>> = {
  wakingUpInterval: {
    description: "Since the first `night`, interval of `nights` when the `two sisters` are waking up. In other words, they wake up every other night if value is `1`. If set to `0`, they are waking up the first night only",
    ...convertMongoosePropOptionsToApiPropertyOptions(TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval),
  },
};

export {
  TWO_SISTERS_GAME_OPTIONS_API_PROPERTIES,
  TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS,
};