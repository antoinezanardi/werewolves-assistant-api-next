import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { ThreeBrothersGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/three-brothers-game-options/three-brothers-game-options.schema";

const THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({
  wakingUpInterval: {
    default: DEFAULT_GAME_OPTIONS.roles.threeBrothers.wakingUpInterval,
    minimum: 0,
    maximum: 5,
  },
});

const THREE_BROTHERS_GAME_OPTIONS_API_PROPERTIES: Record<keyof ThreeBrothersGameOptions, ApiPropertyOptions> = Object.freeze({
  wakingUpInterval: {
    description: "Since the first `night`, interval of `nights` when the `three brothers` are waking up. In other words, they wake up every other night if value is `1`. If set to `0`, they are waking up the first night only",
    ...THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval,
  },
});

export {
  THREE_BROTHERS_GAME_OPTIONS_API_PROPERTIES,
  THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS,
};