
import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { SheriffElectionGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options.schema";

const sheriffElectionGameOptionsFieldsSpecs = Object.freeze({
  turn: {
    default: defaultGameOptions.roles.sheriff.electedAt.turn,
    minimum: 1,
  },
  phase: { default: defaultGameOptions.roles.sheriff.electedAt.phase },
});

const sheriffElectionGameOptionsApiProperties: Record<keyof SheriffElectionGameOptions, ApiPropertyOptions> = Object.freeze({
  turn: {
    description: "Game's turn when the `sheriff` is elected",
    ...sheriffElectionGameOptionsFieldsSpecs.turn,
  },
  phase: {
    description: "Game's phase when the `sheriff` is elected",
    ...sheriffElectionGameOptionsFieldsSpecs.phase,
  },
});

export { sheriffElectionGameOptionsApiProperties, sheriffElectionGameOptionsFieldsSpecs };