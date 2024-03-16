import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { FoxGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/fox-game-options/fox-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const FOX_GAME_OPTIONS_FIELDS_SPECS = {
  isPowerlessIfMissesWerewolf: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.fox.isPowerlessIfMissesWerewolf,
  },
} as const satisfies Record<keyof FoxGameOptions, MongoosePropOptions>;

const FOX_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof FoxGameOptions, ApiPropertyOptions>> = {
  isPowerlessIfMissesWerewolf: {
    description: "If set to `true`, the `fox` will loose his power if he doesn't find a player from the `werewolves` side during his turn if he doesn't skip",
    ...convertMongoosePropOptionsToApiPropertyOptions(FOX_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfMissesWerewolf),
  },
};

export {
  FOX_GAME_OPTIONS_API_PROPERTIES,
  FOX_GAME_OPTIONS_FIELDS_SPECS,
};