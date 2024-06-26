import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_VICTORY_TYPES } from "@/modules/game/constants/game-victory/game-victory.constants";
import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";
import type { GameVictory } from "@/modules/game/schemas/game-victory/game-victory.schema";

import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";
import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";

const GAME_VICTORY_FIELDS_SPECS = {
  type: {
    required: true,
    enum: GAME_VICTORY_TYPES,
  },
  winners: {
    required: false,
    type: [PLAYER_SCHEMA],
    minItems: 1,
    default: undefined,
  },
} as const satisfies Record<keyof GameVictory, MongoosePropOptions>;

const GAME_VICTORY_API_PROPERTIES: ReadonlyDeep<Record<keyof GameVictory, ApiPropertyOptions>> = {
  type: {
    description: "Type of victory of this game",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_VICTORY_FIELDS_SPECS.type),
  },
  winners: {
    description: "List of players who won the game, even the dead ones. Not set if `type` is `none`",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_VICTORY_FIELDS_SPECS.winners),
  },
};

export {
  GAME_VICTORY_FIELDS_SPECS,
  GAME_VICTORY_API_PROPERTIES,
};