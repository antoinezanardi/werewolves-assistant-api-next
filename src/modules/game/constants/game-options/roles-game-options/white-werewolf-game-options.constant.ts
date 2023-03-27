import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { WhiteWerewolfGameOptions } from "../../../schemas/game-options/roles-game-options/white-werewolf-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const whiteWerewolfGameOptionsFieldsSpecs = Object.freeze({
  wakingUpInterval: {
    default: defaultGameOptions.roles.whiteWerewolf.wakingUpInterval,
    minimum: 1,
    maximum: 5,
  },
});

const whiteWerewolfGameOptionsApiProperties: Record<keyof WhiteWerewolfGameOptions, ApiPropertyOptions> = Object.freeze({
  wakingUpInterval: {
    description: "Since the first `night`, interval of `nights` when the `white werewolf` is waking up. In other words, he wakes up every other night if value is `1`",
    ...whiteWerewolfGameOptionsFieldsSpecs.wakingUpInterval,
  },
});

export { whiteWerewolfGameOptionsApiProperties, whiteWerewolfGameOptionsFieldsSpecs };