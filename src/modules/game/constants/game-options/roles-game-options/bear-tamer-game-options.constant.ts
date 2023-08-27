import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { BearTamerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/bear-tamer-game-options.schema";

const bearTamerGameOptionsFieldsSpecs = Object.freeze({ doesGrowlIfInfected: { default: defaultGameOptions.roles.bearTamer.doesGrowlIfInfected } });

const bearTamerGameOptionsApiProperties: Record<keyof BearTamerGameOptions, ApiPropertyOptions> = Object.freeze({
  doesGrowlIfInfected: {
    description: "If set to `true`, the bear tamer will have the `growls` attribute until he dies if he is `infected`",
    ...bearTamerGameOptionsFieldsSpecs.doesGrowlIfInfected,
  },
});

export { bearTamerGameOptionsApiProperties, bearTamerGameOptionsFieldsSpecs };