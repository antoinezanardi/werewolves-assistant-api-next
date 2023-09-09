import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { IdiotGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/idiot-game-options/idiot-game-options.schema";

const IDIOT_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({ doesDieOnAncientDeath: { default: DEFAULT_GAME_OPTIONS.roles.idiot.doesDieOnAncientDeath } });

const IDIOT_GAME_OPTIONS_API_PROPERTIES: Record<keyof IdiotGameOptions, ApiPropertyOptions> = Object.freeze({
  doesDieOnAncientDeath: {
    description: "If set to `true`, the idiot will die if his role is revealed and the ancient just died",
    ...IDIOT_GAME_OPTIONS_FIELDS_SPECS.doesDieOnAncientDeath,
  },
});

export {
  IDIOT_GAME_OPTIONS_API_PROPERTIES,
  IDIOT_GAME_OPTIONS_FIELDS_SPECS,
};