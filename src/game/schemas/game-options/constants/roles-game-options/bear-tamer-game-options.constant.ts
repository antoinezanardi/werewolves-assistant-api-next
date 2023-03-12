import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { BearTamerGameOptions } from "../../schemas/roles-game-options/bear-tamer-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const bearTamerGameOptionsApiProperties: Record<keyof BearTamerGameOptions, ApiPropertyOptions> = Object.freeze({
  doesGrowlIfInfected: {
    description: "If set to `true`, the bear tamer will have the `growls` attribute until he dies if he is `infected`",
    default: defaultGameOptions.roles.bearTamer.doesGrowlIfInfected,
  },
});

export { bearTamerGameOptionsApiProperties };