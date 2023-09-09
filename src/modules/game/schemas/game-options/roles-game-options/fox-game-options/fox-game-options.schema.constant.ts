import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { FoxGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/fox-game-options/fox-game-options.schema";

const FOX_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({ isPowerlessIfMissesWerewolf: { default: DEFAULT_GAME_OPTIONS.roles.fox.isPowerlessIfMissesWerewolf } });

const FOX_GAME_OPTIONS_API_PROPERTIES: Record<keyof FoxGameOptions, ApiPropertyOptions> = Object.freeze({
  isPowerlessIfMissesWerewolf: {
    description: "If set to `true`, the `fox` will loose his power if he doesn't find a player from the `werewolves` side during his turn if he doesn't skip",
    ...FOX_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfMissesWerewolf,
  },
});

export {
  FOX_GAME_OPTIONS_API_PROPERTIES,
  FOX_GAME_OPTIONS_FIELDS_SPECS,
};