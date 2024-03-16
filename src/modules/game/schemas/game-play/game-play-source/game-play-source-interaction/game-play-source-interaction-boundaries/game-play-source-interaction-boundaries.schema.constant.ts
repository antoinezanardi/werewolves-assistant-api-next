import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import type { GamePlaySourceInteractionBoundaries } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction-boundaries/game-play-source-interaction-boundaries.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_SPECS_FIELDS = {
  min: {
    required: true,
    min: 0,
  },
  max: {
    required: true,
    min: 1,
  },
} as const satisfies Record<keyof GamePlaySourceInteractionBoundaries, MongoosePropOptions>;

const GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_API_PROPERTIES: ReadonlyDeep<Record<keyof GamePlaySourceInteractionBoundaries, ApiPropertyOptions>> = {
  min: {
    description: "Minimum number of eligible targets for this play. In case of votes, this is the minimum number of votes required.",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_SPECS_FIELDS.min),
  },
  max: {
    description: "Maximum number of eligible targets for this play. In case of votes, this is the maximum number of votes allowed.",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_SPECS_FIELDS.max),
  },
};

export {
  GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_SPECS_FIELDS,
  GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_API_PROPERTIES,
};