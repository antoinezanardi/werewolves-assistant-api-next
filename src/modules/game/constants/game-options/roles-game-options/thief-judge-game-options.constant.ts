import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { ThiefGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/thief-game-options.schema";

const THIEF_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({
  mustChooseBetweenWerewolves: { default: DEFAULT_GAME_OPTIONS.roles.thief.mustChooseBetweenWerewolves },
  additionalCardsCount: {
    default: DEFAULT_GAME_OPTIONS.roles.thief.additionalCardsCount,
    minimum: 1,
    maximum: 5,
  },
});

const THIEF_GAME_OPTIONS_API_PROPERTIES: Record<keyof ThiefGameOptions, ApiPropertyOptions> = Object.freeze({
  mustChooseBetweenWerewolves: {
    description: "If set to `true`, if all `thief` additional cards are from the `werewolves` side, he can't skip and must choose one",
    ...THIEF_GAME_OPTIONS_FIELDS_SPECS.mustChooseBetweenWerewolves,
  },
  additionalCardsCount: {
    description: "Number of additional cards for the `thief` at the beginning of the game",
    ...THIEF_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount,
  },
});

export {
  THIEF_GAME_OPTIONS_API_PROPERTIES,
  THIEF_GAME_OPTIONS_FIELDS_SPECS,
};