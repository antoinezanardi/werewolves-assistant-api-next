import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { PiedPiperGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/pied-piper-game-options.schema";

const PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({
  charmedPeopleCountPerNight: {
    default: DEFAULT_GAME_OPTIONS.roles.piedPiper.charmedPeopleCountPerNight,
    minimum: 1,
    maximum: 5,
  },
  isPowerlessIfInfected: { default: DEFAULT_GAME_OPTIONS.roles.piedPiper.isPowerlessIfInfected },
});

const PIED_PIPER_GAME_OPTIONS_API_PROPERTIES: Record<keyof PiedPiperGameOptions, ApiPropertyOptions> = Object.freeze({
  charmedPeopleCountPerNight: {
    description: "Number of `charmed` people by the `pied piper` per night if there are enough targets (or number of not charmed players otherwise)",
    ...PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight,
  },
  isPowerlessIfInfected: {
    description: "If set to `true`, `pied piper` will be `powerless` if he is infected by the `vile father of wolves`",
    ...PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfInfected,
  },
});

export {
  PIED_PIPER_GAME_OPTIONS_API_PROPERTIES,
  PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS,
};