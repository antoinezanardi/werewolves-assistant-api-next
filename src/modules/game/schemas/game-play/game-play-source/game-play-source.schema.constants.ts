import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_PLAY_SOURCE_INTERACTION_SCHEMA } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema";
import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";
import { GAME_PLAY_SOURCE_NAMES } from "@/modules/game/constants/game-play/game-play.constants";
import type { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
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
  interactions: {
    required: false,
    type: [GAME_PLAY_SOURCE_INTERACTION_SCHEMA],
    default: undefined,
  },
} as const satisfies Record<keyof GamePlaySource, MongoosePropOptions>;

const GAME_PLAY_SOURCE_API_PROPERTIES: ReadonlyDeep<Record<keyof GamePlaySource, ApiPropertyOptions>> = {
  name: {
    description: "Source's name of the play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SOURCE_FIELDS_SPECS.name),
  },
  players: {
    description: "Expected players who will make the play. Only set for the current play, not the upcoming one",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SOURCE_FIELDS_SPECS.players),
  },
  interactions: {
    description: "Source's interactions of the play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SOURCE_FIELDS_SPECS.interactions),
  },
};

export {
  GAME_PLAY_SOURCE_FIELDS_SPECS,
  GAME_PLAY_SOURCE_API_PROPERTIES,
};