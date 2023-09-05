import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { TwoSistersGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/two-sisters-game-options/two-sisters-game-options.schema";

const TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({
  wakingUpInterval: {
    default: DEFAULT_GAME_OPTIONS.roles.twoSisters.wakingUpInterval,
    minimum: 0,
    maximum: 5,
  },
});

const TWO_SISTERS_GAME_OPTIONS_API_PROPERTIES: Record<keyof TwoSistersGameOptions, ApiPropertyOptions> = Object.freeze({
  wakingUpInterval: {
    description: "Since the first `night`, interval of `nights` when the `two sisters` are waking up. In other words, they wake up every other night if value is `1`. If set to `0`, they are waking up the first night only",
    ...TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval,
  },
});

export {
  TWO_SISTERS_GAME_OPTIONS_API_PROPERTIES,
  TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS,
};