import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ThiefGameOptions } from "../../../schemas/game-options/roles-game-options/thief-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const thiefGameOptionsFieldsSpecs = Object.freeze({
  mustChooseBetweenWerewolves: { default: defaultGameOptions.roles.thief.mustChooseBetweenWerewolves },
  additionalCardsCount: {
    default: defaultGameOptions.roles.thief.additionalCardsCount,
    minimum: 1,
    maximum: 5,
  },
});

const thiefGameOptionsApiProperties: Record<keyof ThiefGameOptions, ApiPropertyOptions> = Object.freeze({
  mustChooseBetweenWerewolves: {
    description: "If set to `true`, if all `thief` additional cards are from the `werewolves` side, he can't skip and must choose one",
    ...thiefGameOptionsFieldsSpecs.mustChooseBetweenWerewolves,
  },
  additionalCardsCount: {
    description: "Number of additional cards for the `thief` at the beginning of the game",
    ...thiefGameOptionsFieldsSpecs.additionalCardsCount,
  },
});

export { thiefGameOptionsApiProperties, thiefGameOptionsFieldsSpecs };