import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { AncientGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/ancient-game-options.schema";

const ANCIENT_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({
  livesCountAgainstWerewolves: {
    default: DEFAULT_GAME_OPTIONS.roles.ancient.livesCountAgainstWerewolves,
    minimum: 1,
    maximum: 5,
  },
  doesTakeHisRevenge: { default: DEFAULT_GAME_OPTIONS.roles.ancient.doesTakeHisRevenge },
});

const ANCIENT_GAME_OPTIONS_API_PROPERTIES: Record<keyof AncientGameOptions, ApiPropertyOptions> = Object.freeze({
  livesCountAgainstWerewolves: {
    description: "Number of lives `ancient` has against `werewolves`",
    ...ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves,
  },
  doesTakeHisRevenge: {
    description: "If set to `true`, the ancient will make all players from the villagers side powerless if he dies from them",
    ...ANCIENT_GAME_OPTIONS_FIELDS_SPECS.doesTakeHisRevenge,
  },
});

export {
  ANCIENT_GAME_OPTIONS_API_PROPERTIES,
  ANCIENT_GAME_OPTIONS_FIELDS_SPECS,
};