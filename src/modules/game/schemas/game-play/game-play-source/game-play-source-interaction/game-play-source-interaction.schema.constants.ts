import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_SOURCES } from "@/modules/game/constants/game.constants";
import { PLAYER_INTERACTION_TYPES } from "@/modules/game/constants/player/player-interaction/player-interaction.constants";
import { GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_SCHEMA } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction-boundaries/game-play-source-interaction-boundaries.schema";
import type { GamePlaySourceInteraction } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema";
import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";

import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_PLAY_SOURCE_INTERACTION_FIELDS_SPECS = {
  source: {
    required: true,
    enum: GAME_SOURCES,
  },
  type: {
    required: true,
    enum: PLAYER_INTERACTION_TYPES,
  },
  eligibleTargets: {
    required: true,
    type: [PLAYER_SCHEMA],
    minItems: 1,
  },
  boundaries: {
    required: true,
    type: GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_SCHEMA,
  },
} as const satisfies Record<keyof GamePlaySourceInteraction, MongoosePropOptions>;

const GAME_PLAY_SOURCE_INTERACTION_API_PROPERTIES: ReadonlyDeep<Record<keyof GamePlaySourceInteraction, ApiPropertyOptions>> = {
  source: {
    description: "Source of the interaction. Most of the time, it's the game play source itself. But sometimes, it can be a particular player of the source's group (e.g. the Devoted Servant which is a player of the source's group 'Survivors')",
    ...GAME_PLAY_SOURCE_INTERACTION_FIELDS_SPECS.source,
  },
  type: {
    description: "Type of interaction",
    ...GAME_PLAY_SOURCE_INTERACTION_FIELDS_SPECS.type,
  },
  eligibleTargets: {
    description: "Players that the source can interact with",
    ...GAME_PLAY_SOURCE_INTERACTION_FIELDS_SPECS.eligibleTargets,
  },
  boundaries: {
    description: "Boundaries of the interaction",
    ...GAME_PLAY_SOURCE_INTERACTION_FIELDS_SPECS.boundaries,
  },
};

export {
  GAME_PLAY_SOURCE_INTERACTION_FIELDS_SPECS,
  GAME_PLAY_SOURCE_INTERACTION_API_PROPERTIES,
};