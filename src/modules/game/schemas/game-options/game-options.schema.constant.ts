import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { COMPOSITION_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/composition-game-options/composition-game-options.schema";
import { ROLES_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/roles-game-options.schema";
import { VOTES_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/votes-game-options/votes-game-options.schema";
import type { GameOptions } from "@/modules/game/schemas/game-options/game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_OPTIONS_FIELDS_SPECS = {
  composition: {
    required: true,
    type: COMPOSITION_GAME_OPTIONS_SCHEMA,
    default: {},
  },
  votes: {
    required: true,
    type: VOTES_GAME_OPTIONS_SCHEMA,
    default: {},
  },
  roles: {
    required: true,
    type: ROLES_GAME_OPTIONS_SCHEMA,
    default: {},
  },
} satisfies Record<keyof GameOptions, MongoosePropOptions>;

const GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof GameOptions, ApiPropertyOptions>> = {
  composition: {
    description: "Game's composition options",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_OPTIONS_FIELDS_SPECS.composition),
  },
  votes: {
    description: "Game's votes options",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_OPTIONS_FIELDS_SPECS.votes),
  },
  roles: {
    description: "Game's roles options",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_OPTIONS_FIELDS_SPECS.roles),
  },
};

export {
  GAME_OPTIONS_FIELDS_SPECS,
  GAME_OPTIONS_API_PROPERTIES,
};