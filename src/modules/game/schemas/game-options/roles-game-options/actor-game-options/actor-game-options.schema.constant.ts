import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import type { ActorGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/actor-game-options/actor-game-options.schema";
import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const ACTOR_GAME_OPTIONS_FIELDS_SPECS = {
  isPowerlessOnWerewolvesSide: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.actor.isPowerlessOnWerewolvesSide,
  },
} as const satisfies Record<keyof ActorGameOptions, MongoosePropOptions>;

const ACTOR_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof ActorGameOptions, ApiPropertyOptions>> = {
  isPowerlessOnWerewolvesSide: {
    description: "If set to `true`, the actor becomes powerless if he switches to the werewolves side.",
    ...convertMongoosePropOptionsToApiPropertyOptions(ACTOR_GAME_OPTIONS_FIELDS_SPECS.isPowerlessOnWerewolvesSide),
  },
};

export {
  ACTOR_GAME_OPTIONS_API_PROPERTIES,
  ACTOR_GAME_OPTIONS_FIELDS_SPECS,
};