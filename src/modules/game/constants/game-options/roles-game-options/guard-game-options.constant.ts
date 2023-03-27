import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { GuardGameOptions } from "../../../schemas/game-options/roles-game-options/guard-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const guardGameOptionsFieldsSpecs = Object.freeze({ canProtectTwice: { default: defaultGameOptions.roles.guard.canProtectTwice } });

const guardGameOptionsApiProperties: Record<keyof GuardGameOptions, ApiPropertyOptions> = Object.freeze({
  canProtectTwice: {
    description: "If set to `true`, the guard can protect twice in a row the same target",
    ...guardGameOptionsFieldsSpecs.canProtectTwice,
  },
});

export { guardGameOptionsApiProperties, guardGameOptionsFieldsSpecs };