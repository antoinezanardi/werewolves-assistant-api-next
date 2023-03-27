import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { BearTamerGameOptions } from "../../../schemas/game-options/roles-game-options/bear-tamer-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const bearTamerGameOptionsFieldsSpecs = Object.freeze({ doesGrowlIfInfected: { default: defaultGameOptions.roles.bearTamer.doesGrowlIfInfected } });

const bearTamerGameOptionsApiProperties: Record<keyof BearTamerGameOptions, ApiPropertyOptions> = Object.freeze({
  doesGrowlIfInfected: {
    description: "If set to `true`, the bear tamer will have the `growls` attribute until he dies if he is `infected`",
    ...bearTamerGameOptionsFieldsSpecs.doesGrowlIfInfected,
  },
});

export { bearTamerGameOptionsApiProperties, bearTamerGameOptionsFieldsSpecs };