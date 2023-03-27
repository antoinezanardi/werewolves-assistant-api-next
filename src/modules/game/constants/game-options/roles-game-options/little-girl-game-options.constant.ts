import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { LittleGirlGameOptions } from "../../../schemas/game-options/roles-game-options/little-girl-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const littleGirlGameOptionsFieldsSpecs = Object.freeze({ isProtectedByGuard: { default: defaultGameOptions.roles.littleGirl.isProtectedByGuard } });

const littleGirlGameOptionsApiProperties: Record<keyof LittleGirlGameOptions, ApiPropertyOptions> = Object.freeze({
  isProtectedByGuard: {
    description: "If set to `false`, the `little girl` won't be protected by the `guard` from the `werewolves` attacks",
    ...littleGirlGameOptionsFieldsSpecs.isProtectedByGuard,
  },
});

export { littleGirlGameOptionsApiProperties, littleGirlGameOptionsFieldsSpecs };