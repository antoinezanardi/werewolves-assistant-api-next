import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { SheriffElectionGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options.schema";

const SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({
  turn: {
    default: DEFAULT_GAME_OPTIONS.roles.sheriff.electedAt.turn,
    minimum: 1,
  },
  phase: { default: DEFAULT_GAME_OPTIONS.roles.sheriff.electedAt.phase },
});

const SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES: Record<keyof SheriffElectionGameOptions, ApiPropertyOptions> = Object.freeze({
  turn: {
    description: "Game's turn when the `sheriff` is elected",
    ...SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.turn,
  },
  phase: {
    description: "Game's phase when the `sheriff` is elected",
    ...SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.phase,
  },
});

export {
  SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES,
  SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS,
};