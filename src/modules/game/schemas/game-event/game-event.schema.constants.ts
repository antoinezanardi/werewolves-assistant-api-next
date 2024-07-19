import { GAME_EVENT_TYPES } from "@/modules/game/constants/game-event/game-event.constants";
import type { GameEvent } from "@/modules/game/schemas/game-event/game-event.schema";
import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";
import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

const GAME_EVENT_FIELDS_SPECS = {
  _id: { required: true },
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
  _id: {
    description: "Game event's Mongo ObjectId",
    example: "507f1f77bcf86cd799439011",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_EVENT_FIELDS_SPECS._id),
  },
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