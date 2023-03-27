import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { SheriffElectionGameOptions } from "../../../../schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options.schema";
import { defaultGameOptions } from "../../game-options.constant";

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