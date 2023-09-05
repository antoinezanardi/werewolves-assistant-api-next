import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { SeerGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/seer-game-options/seer-game-options.schema";

const SEER_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({
  isTalkative: { default: DEFAULT_GAME_OPTIONS.roles.seer.isTalkative },
  canSeeRoles: { default: DEFAULT_GAME_OPTIONS.roles.seer.canSeeRoles },
});

const SEER_GAME_OPTIONS_API_PROPERTIES: Record<keyof SeerGameOptions, ApiPropertyOptions> = Object.freeze({
  isTalkative: {
    description: "If set to `true`, the game master must say out loud what the `seer` saw during her night, otherwise, he must mime the seen role to the `seer`",
    ...SEER_GAME_OPTIONS_FIELDS_SPECS.isTalkative,
  },
  canSeeRoles: {
    description: "If set to `true`, the seer can see the exact `role` of the target, otherwise, she only sees the `side`",
    ...SEER_GAME_OPTIONS_FIELDS_SPECS.canSeeRoles,
  },
});

export {
  SEER_GAME_OPTIONS_API_PROPERTIES,
  SEER_GAME_OPTIONS_FIELDS_SPECS,
};