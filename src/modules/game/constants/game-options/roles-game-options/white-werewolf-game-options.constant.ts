import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { WhiteWerewolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/white-werewolf-game-options.schema";

const WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({
  wakingUpInterval: {
    default: DEFAULT_GAME_OPTIONS.roles.whiteWerewolf.wakingUpInterval,
    minimum: 1,
    maximum: 5,
  },
});

const WHITE_WEREWOLF_GAME_OPTIONS_API_PROPERTIES: Record<keyof WhiteWerewolfGameOptions, ApiPropertyOptions> = Object.freeze({
  wakingUpInterval: {
    description: "Since the first `night`, interval of `nights` when the `white werewolf` is waking up. In other words, he wakes up every other night if value is `1`",
    ...WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval,
  },
});

export {
  WHITE_WEREWOLF_GAME_OPTIONS_API_PROPERTIES,
  WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS,
};