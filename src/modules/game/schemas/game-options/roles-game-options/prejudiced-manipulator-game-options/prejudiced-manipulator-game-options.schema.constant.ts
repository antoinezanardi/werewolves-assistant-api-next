import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import type { PrejudicedManipulatorGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/prejudiced-manipulator-game-options/prejudiced-manipulator-game-options.schema";
import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PREJUDICED_MANIPULATOR_GAME_OPTIONS_FIELDS_SPECS = {
  isPowerlessIfInfected: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.fox.isPowerlessIfMissesWerewolf,
  },
} as const satisfies Record<keyof PrejudicedManipulatorGameOptions, MongoosePropOptions>;

const PREJUDICED_MANIPULATOR_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof PrejudicedManipulatorGameOptions, ApiPropertyOptions>> = {
  isPowerlessIfInfected: {
    description: "If set to `true`, `prejudiced manipulator` will be `powerless` if he is infected by the `accursed wolf-father`",
    ...convertMongoosePropOptionsToApiPropertyOptions(PREJUDICED_MANIPULATOR_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfInfected),
  },
};

export {
  PREJUDICED_MANIPULATOR_GAME_OPTIONS_API_PROPERTIES,
  PREJUDICED_MANIPULATOR_GAME_OPTIONS_FIELDS_SPECS,
};