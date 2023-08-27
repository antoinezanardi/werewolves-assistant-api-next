import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { WhiteWerewolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/white-werewolf-game-options.schema";

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