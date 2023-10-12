import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { RoleNames } from "@/modules/role/enums/role.enum";
import type { PlayerRole } from "@/modules/game/schemas/player/player-role/player-role.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PLAYER_ROLE_FIELDS_SPECS = {
  original: {
    required: true,
    enum: Object.values(RoleNames),
  },
  current: {
    required: true,
    enum: Object.values(RoleNames),
  },
  isRevealed: { required: true },
} satisfies Record<keyof PlayerRole, MongoosePropOptions>;

const PLAYER_ROLE_API_PROPERTIES: ReadonlyDeep<Record<keyof PlayerRole, ApiPropertyOptions>> = {
  original: {
    description: "Player's original role when the game started",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ROLE_FIELDS_SPECS.original),
  },
  current: {
    description: "Player's current role",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ROLE_FIELDS_SPECS.current),
  },
  isRevealed: {
    description: "If player's role is revealed to other players",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ROLE_FIELDS_SPECS.isRevealed),
  },
};

export {
  PLAYER_ROLE_FIELDS_SPECS,
  PLAYER_ROLE_API_PROPERTIES,
};