import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_EVENT_TYPES } from "@/modules/game/constants/game-event/game-event.constants";
import type { GameEvent } from "@/modules/game/schemas/game-event/game-event.schema";
import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_EVENT_FIELDS_SPECS = {
  type: {
    required: true,
    enum: GAME_EVENT_TYPES,
  },
  players: {
    required: false,
    type: [PLAYER_SCHEMA],
    default: undefined,
  },
} as const satisfies Record<keyof GameEvent, MongoosePropOptions>;

const GAME_EVENT_API_PROPERTIES: ReadonlyDeep<Record<keyof GameEvent, ApiPropertyOptions>> = {
  type: {
    description: "Game event's type",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_EVENT_FIELDS_SPECS.type),
  },
  players: {
    description: "Game event's players",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_EVENT_FIELDS_SPECS.players),
  },
};

export {
  GAME_EVENT_FIELDS_SPECS,
  GAME_EVENT_API_PROPERTIES,
};