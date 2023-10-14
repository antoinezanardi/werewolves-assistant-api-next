import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_PLAY_SOURCE_SCHEMA } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { GamePlayActions, GamePlayCauses, GamePlayOccurrences } from "@/modules/game/enums/game-play.enum";
import type { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_PLAY_SPECS_FIELDS = {
  source: {
    required: true,
    type: GAME_PLAY_SOURCE_SCHEMA,
  },
  action: {
    required: true,
    enum: Object.values(GamePlayActions),
  },
  cause: {
    required: false,
    enum: Object.values(GamePlayCauses),
  },
  canBeSkipped: { required: false },
  occurrence: {
    required: true,
    enum: Object.values(GamePlayOccurrences),
  },
} as const satisfies Record<keyof GamePlay, MongoosePropOptions>;

const GAME_PLAY_API_PROPERTIES: ReadonlyDeep<Record<keyof GamePlay, ApiPropertyOptions>> = Object.freeze({
  source: {
    description: "Which role or group of people need to perform this action, with expected players to play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SPECS_FIELDS.source),
  },
  action: {
    description: "What action need to be performed for this play",
    example: GamePlayActions.VOTE,
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SPECS_FIELDS.action),
  },
  cause: {
    description: "Why this play needs to be performed",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SPECS_FIELDS.cause),
  },
  canBeSkipped: {
    description: "Whether this play can be skipped or not. Only set for the current game play (first in the upcoming game plays)",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SPECS_FIELDS.canBeSkipped),
  },
  occurrence: {
    description: "When this play occurs in the game",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SPECS_FIELDS.occurrence),
  },
});

export {
  GAME_PLAY_SPECS_FIELDS,
  GAME_PLAY_API_PROPERTIES,
};