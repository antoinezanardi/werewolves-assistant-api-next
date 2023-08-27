
import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { LittleGirlGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/little-girl-game-options.schema";

const littleGirlGameOptionsFieldsSpecs = Object.freeze({ isProtectedByGuard: { default: defaultGameOptions.roles.littleGirl.isProtectedByGuard } });

const littleGirlGameOptionsApiProperties: Record<keyof LittleGirlGameOptions, ApiPropertyOptions> = Object.freeze({
  isProtectedByGuard: {
    description: "If set to `false`, the `little girl` won't be protected by the `guard` from the `werewolves` attacks",
    ...littleGirlGameOptionsFieldsSpecs.isProtectedByGuard,
  },
});

export { littleGirlGameOptionsApiProperties, littleGirlGameOptionsFieldsSpecs };