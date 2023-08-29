import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { BigBadWolfGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/big-bad-wolf-game-options.schema";

const BIG_BAD_WOLF_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({ isPowerlessIfWerewolfDies: { default: DEFAULT_GAME_OPTIONS.roles.bigBadWolf.isPowerlessIfWerewolfDies } });

const BIG_BAD_WOLF_GAME_OPTIONS_API_PROPERTIES: Record<keyof BigBadWolfGameOptions, ApiPropertyOptions> = Object.freeze({
  isPowerlessIfWerewolfDies: {
    description: "If set to `true`, `big bad wolf` won't wake up anymore during the night if at least one player from the `werewolves` side died",
    ...BIG_BAD_WOLF_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfWerewolfDies,
  },
});

export {
  BIG_BAD_WOLF_GAME_OPTIONS_API_PROPERTIES,
  BIG_BAD_WOLF_GAME_OPTIONS_FIELDS_SPECS,
};