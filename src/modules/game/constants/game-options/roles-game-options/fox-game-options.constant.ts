
import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { FoxGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/fox-game-options.schema";

const foxGameOptionsFieldsSpecs = Object.freeze({ isPowerlessIfMissesWerewolf: { default: defaultGameOptions.roles.fox.isPowerlessIfMissesWerewolf } });

const foxGameOptionsApiProperties: Record<keyof FoxGameOptions, ApiPropertyOptions> = Object.freeze({
  isPowerlessIfMissesWerewolf: {
    description: "If set to `true`, the `fox` will loose his power if he doesn't find a player from the `werewolves` side during his turn if he doesn't skip",
    ...foxGameOptionsFieldsSpecs.isPowerlessIfMissesWerewolf,
  },
});

export { foxGameOptionsApiProperties, foxGameOptionsFieldsSpecs };