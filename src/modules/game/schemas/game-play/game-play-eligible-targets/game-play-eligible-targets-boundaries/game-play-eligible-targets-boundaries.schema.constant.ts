import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import type { GamePlayEligibleTargetsBoundaries } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SPECS_FIELDS = {
  min: {
    required: true,
    min: 0,
  },
  max: {
    required: true,
    min: 1,
  },
} as const satisfies Record<keyof GamePlayEligibleTargetsBoundaries, MongoosePropOptions>;

const GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_API_PROPERTIES: ReadonlyDeep<Record<keyof GamePlayEligibleTargetsBoundaries, ApiPropertyOptions>> = {
  min: {
    description: "Minimum number of eligible targets for this play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SPECS_FIELDS.min),
  },
  max: {
    description: "Maximum number of eligible targets for this play",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SPECS_FIELDS.max),
  },
};

export {
  GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SPECS_FIELDS,
  GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_API_PROPERTIES,
};