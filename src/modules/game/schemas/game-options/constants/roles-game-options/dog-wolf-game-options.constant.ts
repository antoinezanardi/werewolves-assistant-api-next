import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { DogWolfGameOptions } from "../../schemas/roles-game-options/dog-wolf-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const dogWolfGameOptionsFieldsSpecs = Object.freeze({ isChosenSideRevealed: { default: defaultGameOptions.roles.dogWolf.isChosenSideRevealed } });

const dogWolfGameOptionsApiProperties: Record<keyof DogWolfGameOptions, ApiPropertyOptions> = Object.freeze({
  isChosenSideRevealed: {
    description: "If set to `true`, when `dog-wolf` chooses his side at the beginning of the game, the game master will announce the chosen side to other players",
    ...dogWolfGameOptionsFieldsSpecs.isChosenSideRevealed,
  },
});

export { dogWolfGameOptionsApiProperties, dogWolfGameOptionsFieldsSpecs };