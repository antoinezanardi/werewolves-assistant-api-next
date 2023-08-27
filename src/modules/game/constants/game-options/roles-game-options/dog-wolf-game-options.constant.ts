import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { DogWolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/dog-wolf-game-options.schema";

const dogWolfGameOptionsFieldsSpecs = Object.freeze({ isChosenSideRevealed: { default: defaultGameOptions.roles.dogWolf.isChosenSideRevealed } });

const dogWolfGameOptionsApiProperties: Record<keyof DogWolfGameOptions, ApiPropertyOptions> = Object.freeze({
  isChosenSideRevealed: {
    description: "If set to `true`, when `dog-wolf` chooses his side at the beginning of the game, the game master will announce the chosen side to other players",
    ...dogWolfGameOptionsFieldsSpecs.isChosenSideRevealed,
  },
});

export { dogWolfGameOptionsApiProperties, dogWolfGameOptionsFieldsSpecs };