import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { PlayerDeathCauses } from "@/modules/game/enums/player.enum";
import { GAME_SOURCES } from "@/modules/game/constants/game.constant";
import type { PlayerDeath } from "@/modules/game/schemas/player/player-death/player-death.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PLAYER_DEATH_FIELDS_SPECS = {
  source: {
    required: true,
    enum: Object.values(GAME_SOURCES),
  },
  cause: {
    required: true,
    enum: Object.values(PlayerDeathCauses),
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