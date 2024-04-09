import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { ROLE_SIDES } from "@/modules/role/constants/role.constants";
import type { PlayerSide } from "@/modules/game/schemas/player/player-side/player-side.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PLAYER_SIDE_FIELDS_SPECS = {
  original: {
    required: true,
    enum: ROLE_SIDES,
  },
  current: {
    required: true,
    enum: ROLE_SIDES,
  },
} as const satisfies Record<keyof PlayerSide, MongoosePropOptions>;

const PLAYER_SIDE_API_PROPERTIES: ReadonlyDeep<Record<keyof PlayerSide, ApiPropertyOptions>> = {
  original: {
    description: "Player's original side when the game started",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_SIDE_FIELDS_SPECS.original),
  },
  current: {
    description: "Player's current side",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_SIDE_FIELDS_SPECS.current),
  },
};

export {
  PLAYER_SIDE_FIELDS_SPECS,
  PLAYER_SIDE_API_PROPERTIES,
};