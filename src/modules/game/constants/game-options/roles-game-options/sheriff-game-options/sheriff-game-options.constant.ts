import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { SheriffGameOptions } from "../../../../schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";
import { defaultGameOptions } from "../../game-options.constant";

const sheriffGameOptionsFieldsSpecs = Object.freeze({
  isEnabled: { default: defaultGameOptions.roles.sheriff.isEnabled },
  hasDoubledVote: { default: defaultGameOptions.roles.sheriff.hasDoubledVote },
});

const sheriffGameOptionsApiProperties: Record<keyof SheriffGameOptions, ApiPropertyOptions> = Object.freeze({
  isEnabled: {
    description: "If set to `true`, `sheriff` will be elected the first tick and the responsibility will be delegated when he dies. Otherwise, there will be no sheriff in the game and tie in votes will result in another vote between the tied players. In case of another equality, there will be no vote",
    ...sheriffGameOptionsFieldsSpecs.isEnabled,
  },
  electedAt: { description: "When the sheriff is elected during the game" },
  hasDoubledVote: {
    description: "If set to `true`, `sheriff` vote during the village's vote is doubled, otherwise, it's a regular vote",
    ...sheriffGameOptionsFieldsSpecs.hasDoubledVote,
  },
});

export { sheriffGameOptionsApiProperties, sheriffGameOptionsFieldsSpecs };