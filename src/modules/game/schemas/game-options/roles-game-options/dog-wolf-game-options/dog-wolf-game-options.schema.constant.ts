import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { DogWolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/dog-wolf-game-options/dog-wolf-game-options.schema";

const DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({ isChosenSideRevealed: { default: DEFAULT_GAME_OPTIONS.roles.dogWolf.isChosenSideRevealed } });

const DOG_WOLF_GAME_OPTIONS_API_PROPERTIES: Record<keyof DogWolfGameOptions, ApiPropertyOptions> = Object.freeze({
  isChosenSideRevealed: {
    description: "If set to `true`, when `dog-wolf` chooses his side at the beginning of the game, the game master will announce the chosen side to other players",
    ...DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS.isChosenSideRevealed,
  },
});

export {
  DOG_WOLF_GAME_OPTIONS_API_PROPERTIES,
  DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS,
};