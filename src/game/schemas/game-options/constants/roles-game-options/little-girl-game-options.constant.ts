import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { LittleGirlGameOptions } from "../../schemas/roles-game-options/little-girl-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const littleGirlGameOptionsApiProperties: Record<keyof LittleGirlGameOptions, ApiPropertyOptions> = Object.freeze({
  isProtectedByGuard: {
    description: "If set to `false`, the `little girl` won't be protected by the `guard` from the `werewolves` attacks",
    default: defaultGameOptions.roles.littleGirl.isProtectedByGuard,
  },
});

export { littleGirlGameOptionsApiProperties };