import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { SheriffElectionGameOptions } from "../../../schemas/roles-game-options/sheriff-game-options/sheriff-election-game-options.schema";
import { defaultGameOptions } from "../../game-options.constant";

const sheriffElectionGameOptionsApiProperties: Record<keyof SheriffElectionGameOptions, ApiPropertyOptions> = Object.freeze({
  turn: {
    description: "Game's turn when the `sheriff` is elected.",
    default: defaultGameOptions.roles.sheriff.electedAt.turn,
    minimum: 1,
  },
  phase: {
    description: "Game's phase when the `sheriff` is elected",
    default: defaultGameOptions.roles.sheriff.electedAt.phase,
  },
});

export { sheriffElectionGameOptionsApiProperties };