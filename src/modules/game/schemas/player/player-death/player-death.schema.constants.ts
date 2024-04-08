import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { PLAYER_DEATH_CAUSES } from "@/modules/game/constants/player/player-death/player-death.constants";
import { GAME_SOURCES } from "@/modules/game/constants/game.constants";
import type { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PLAYER_DEATH_FIELDS_SPECS = {
  source: {
    required: true,
    enum: Object.values(GAME_SOURCES),
  },
  cause: {
    required: true,
    enum: PLAYER_DEATH_CAUSES,
  },
} as const satisfies Record<keyof PlayerDeath, MongoosePropOptions>;

const PLAYER_DEATH_API_PROPERTIES: ReadonlyDeep<Record<keyof PlayerDeath, ApiPropertyOptions>> = {
  source: {
    description: "Which entity killed the player",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_DEATH_FIELDS_SPECS.source),
  },
  cause: {
    description: "Death's cause of the player",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_DEATH_FIELDS_SPECS.cause),
  },
};

export {
  PLAYER_DEATH_FIELDS_SPECS,
  PLAYER_DEATH_API_PROPERTIES,
};