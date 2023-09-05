import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { SheriffGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";

const SHERIFF_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({
  isEnabled: { default: DEFAULT_GAME_OPTIONS.roles.sheriff.isEnabled },
  hasDoubledVote: { default: DEFAULT_GAME_OPTIONS.roles.sheriff.hasDoubledVote },
});

const SHERIFF_GAME_OPTIONS_API_PROPERTIES: Record<keyof SheriffGameOptions, ApiPropertyOptions> = Object.freeze({
  isEnabled: {
    description: "If set to `true`, `sheriff` will be elected the first tick and the responsibility will be delegated when he dies. Otherwise, there will be no sheriff in the game and tie in votes will result in another vote between the tied players. In case of another equality, there will be no vote",
    ...SHERIFF_GAME_OPTIONS_FIELDS_SPECS.isEnabled,
  },
  electedAt: { description: "When the sheriff is elected during the game" },
  hasDoubledVote: {
    description: "If set to `true`, `sheriff` vote during the village's vote is doubled, otherwise, it's a regular vote",
    ...SHERIFF_GAME_OPTIONS_FIELDS_SPECS.hasDoubledVote,
  },
});

export {
  SHERIFF_GAME_OPTIONS_API_PROPERTIES,
  SHERIFF_GAME_OPTIONS_FIELDS_SPECS,
};