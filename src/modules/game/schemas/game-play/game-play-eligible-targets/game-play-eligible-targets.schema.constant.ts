import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_PLAY_ELIGIBLE_TARGETS_INTERACTABLE_PLAYER_SCHEMA } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/interactable-player.schema";
import type { GamePlayEligibleTargets } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets.schema";
import { GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SCHEMA } from "@/modules/game/schemas/game-play/game-play-eligible-targets/game-play-eligible-targets-boundaries/game-play-eligible-targets-boundaries.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_PLAY_ELIGIBLE_TARGETS_SPECS_FIELDS = {
  interactablePlayers: {
    required: false,
    type: [GAME_PLAY_ELIGIBLE_TARGETS_INTERACTABLE_PLAYER_SCHEMA],
  },
  boundaries: {
    required: false,
    type: GAME_PLAY_ELIGIBLE_TARGETS_BOUNDARIES_SCHEMA,
  },
} as const satisfies Record<keyof GamePlayEligibleTargets, MongoosePropOptions>;

const GAME_PLAY_ELIGIBLE_TARGETS_API_PROPERTIES: ReadonlyDeep<Record<keyof GamePlayEligibleTargets, ApiPropertyOptions>> = {
  interactablePlayers: {
    description: "Players that are eligible targets for this play, associated with possible interactions. If set, the player or group of players can target or vote for these players. Not set if no targets or votes are expected",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_ELIGIBLE_TARGETS_SPECS_FIELDS.interactablePlayers),
  },
  boundaries: {
    description: "Boundaries of eligible targets for this play. If set, the player or group of players can target between `min` and `max` players. Not set if no targets are expected",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PLAY_ELIGIBLE_TARGETS_SPECS_FIELDS.boundaries),
  },
};

export {
  GAME_PLAY_ELIGIBLE_TARGETS_SPECS_FIELDS,
  GAME_PLAY_ELIGIBLE_TARGETS_API_PROPERTIES,
};