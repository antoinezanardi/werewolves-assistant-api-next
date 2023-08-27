import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { PiedPiperGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/pied-piper-game-options.schema";

const piedPiperGameOptionsFieldsSpecs = Object.freeze({
  charmedPeopleCountPerNight: {
    default: defaultGameOptions.roles.piedPiper.charmedPeopleCountPerNight,
    minimum: 1,
    maximum: 5,
  },
  isPowerlessIfInfected: { default: defaultGameOptions.roles.piedPiper.isPowerlessIfInfected },
});

const piedPiperGameOptionsApiProperties: Record<keyof PiedPiperGameOptions, ApiPropertyOptions> = Object.freeze({
  charmedPeopleCountPerNight: {
    description: "Number of `charmed` people by the `pied piper` per night if there are enough targets (or number of not charmed players otherwise)",
    ...piedPiperGameOptionsFieldsSpecs.charmedPeopleCountPerNight,
  },
  isPowerlessIfInfected: {
    description: "If set to `true`, `pied piper` will be `powerless` if he is infected by the `vile father of wolves`",
    ...piedPiperGameOptionsFieldsSpecs.isPowerlessIfInfected,
  },
});

export { piedPiperGameOptionsApiProperties, piedPiperGameOptionsFieldsSpecs };