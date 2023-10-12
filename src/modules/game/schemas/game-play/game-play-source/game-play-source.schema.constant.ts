import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";
import { GAME_PLAY_SOURCE_NAMES } from "@/modules/game/constants/game-play/game-play.constant";
import type { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_PLAY_SOURCE_FIELDS_SPECS = {
  name: {
    required: true,
    enum: Object.values(GAME_PLAY_SOURCE_NAMES),
  },
  players: {
    required: false,
    type: [PLAYER_SCHEMA],
    minItems: 1,
    default: undefined,
  },
} satisfies Record<keyof GamePlaySource, MongoosePropOptions>;

const GAME_PLAY_SOURCE_API_PROPERTIES: ReadonlyDeep<Record<keyof GamePlaySource, ApiPropertyOptions>> = {
  name: {
    description: "Source's name of the play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SOURCE_FIELDS_SPECS.name),
  },
  players: {
    description: "Expected players who will make the play. Only set for the current play, not the upcoming one",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SOURCE_FIELDS_SPECS.players),
  },
};

export {
  GAME_PLAY_SOURCE_FIELDS_SPECS,
  GAME_PLAY_SOURCE_API_PROPERTIES,
};