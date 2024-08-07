import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { PiedPiperGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/pied-piper-game-options/pied-piper-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS = {
  charmedPeopleCountPerNight: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.piedPiper.charmedPeopleCountPerNight,
    min: 1,
    max: 5,
  },
  isPowerlessOnWerewolvesSide: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.piedPiper.isPowerlessOnWerewolvesSide,
  },
  areCharmedPeopleRevealed: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.piedPiper.areCharmedPeopleRevealed,
  },
} as const satisfies Record<keyof PiedPiperGameOptions, MongoosePropOptions>;

const PIED_PIPER_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof PiedPiperGameOptions, ApiPropertyOptions>> = {
  charmedPeopleCountPerNight: {
    description: "Number of `charmed` people by the `pied piper` per night if there are enough targets (or number of not charmed players otherwise)",
    ...convertMongoosePropOptionsToApiPropertyOptions(PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight),
  },
  isPowerlessOnWerewolvesSide: {
    description: "If set to `true`, `pied piper` will be `powerless` if he joins the werewolves side",
    ...convertMongoosePropOptionsToApiPropertyOptions(PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.isPowerlessOnWerewolvesSide),
  },
  areCharmedPeopleRevealed: {
    description: "If set to `true`, `charmed` people by the `pied piper` will be revealed to other players each time the `pied piper` plays",
    ...convertMongoosePropOptionsToApiPropertyOptions(PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.areCharmedPeopleRevealed),
  },
};

export {
  PIED_PIPER_GAME_OPTIONS_API_PROPERTIES,
  PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS,
};