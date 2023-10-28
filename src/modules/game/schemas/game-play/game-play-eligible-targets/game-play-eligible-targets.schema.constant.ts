import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import type { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";
import { GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SCHEMA } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligibile-targets-boudaries/game-play-eligible-targets-boundaries.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_PLAY_ELIGIBLE_TARGETS_SPECS_FIELDS = {
  boundaries: {
    required: false,
    type: GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SCHEMA,
  },
} as const satisfies Record<keyof GamePlayEligibleTargets, MongoosePropOptions>;

const GAME_PLAY_ELIGIBLE_TARGETS_API_PROPERTIES: ReadonlyDeep<Record<keyof GamePlayEligibleTargets, ApiPropertyOptions>> = {
  boundaries: {
    description: "Boundaries of eligible targets for this play. If set, the player or group of players can target between `min` and `max` players. Not set if no targets are expected",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_ELIGIBLE_TARGETS_SPECS_FIELDS.boundaries),
  },
};

export {
  GAME_PLAY_ELIGIBLE_TARGETS_SPECS_FIELDS,
  GAME_PLAY_ELIGIBLE_TARGETS_API_PROPERTIES,
};