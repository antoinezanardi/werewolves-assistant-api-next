import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { RoleSides } from "@/modules/role/enums/role.enum";
import type { PlayerSide } from "@/modules/game/schemas/player/player-side/player-side.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PLAYER_SIDE_FIELDS_SPECS = {
  original: {
    required: true,
    enum: Object.values(RoleSides),
  },
  current: {
    required: true,
    enum: Object.values(RoleSides),
  },
} satisfies Record<keyof PlayerSide, MongoosePropOptions>;

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