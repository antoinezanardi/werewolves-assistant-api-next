import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { AncientGameOptions } from "../../../schemas/game-options/roles-game-options/ancient-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const ancientGameOptionsFieldsSpecs = Object.freeze({
  livesCountAgainstWerewolves: {
    default: defaultGameOptions.roles.ancient.livesCountAgainstWerewolves,
    minimum: 1,
    maximum: 5,
  },
  doesTakeHisRevenge: { default: defaultGameOptions.roles.ancient.doesTakeHisRevenge },
});

const ancientGameOptionsApiProperties: Record<keyof AncientGameOptions, ApiPropertyOptions> = Object.freeze({
  livesCountAgainstWerewolves: {
    description: "Number of lives `ancient` has against `werewolves`",
    ...ancientGameOptionsFieldsSpecs.livesCountAgainstWerewolves,
  },
  doesTakeHisRevenge: {
    description: "If set to `true`, the ancient will make all players from the villagers side powerless if he dies from them",
    ...ancientGameOptionsFieldsSpecs.doesTakeHisRevenge,
  },
});

export { ancientGameOptionsApiProperties, ancientGameOptionsFieldsSpecs };