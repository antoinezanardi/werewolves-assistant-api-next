import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ThiefGameOptions } from "../../schemas/roles-game-options/thief-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const thiefGameOptionsApiProperties: Record<keyof ThiefGameOptions, ApiPropertyOptions> = Object.freeze({
  mustChooseBetweenWerewolves: {
    description: "If set to `true`, if all `thief` additional cards are from the `werewolves` side, he can't skip and must choose one",
    default: defaultGameOptions.roles.thief.mustChooseBetweenWerewolves,
  },
  additionalCardsCount: {
    description: "Number of additional cards for the `thief` at the beginning of the game",
    default: defaultGameOptions.roles.thief.additionalCardsCount,
    minimum: 1,
    maximum: 5,
  },
});

export { thiefGameOptionsApiProperties };