import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { SHERIFF_ELECTION_GAME_OPTIONS_SCHEMA } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options/sheriff-election-game-options.schema";
import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { SheriffGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const SHERIFF_GAME_OPTIONS_FIELDS_SPECS = {
  isEnabled: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.sheriff.isEnabled,
  },
  electedAt: {
    required: true,
    type: SHERIFF_ELECTION_GAME_OPTIONS_SCHEMA,
    default: DEFAULT_GAME_OPTIONS.roles.sheriff.electedAt,
  },
  hasDoubledVote: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.sheriff.hasDoubledVote,
  },
  mustSettleTieInVotes: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.sheriff.mustSettleTieInVotes,
  },
} as const satisfies Record<keyof SheriffGameOptions, MongoosePropOptions>;

const SHERIFF_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof SheriffGameOptions, ApiPropertyOptions>> = {
  isEnabled: {
    description: "If set to `true`, `sheriff` will be elected the first tick and the responsibility will be delegated when he dies. Otherwise, there will be no sheriff in the game and tie in votes will result in another vote between the tied players. In case of another equality, there will be no vote",
    ...convertMongoosePropOptionsToApiPropertyOptions(SHERIFF_GAME_OPTIONS_FIELDS_SPECS.isEnabled),
  },
  electedAt: {
    description: "When the sheriff is elected during the game",
    ...convertMongoosePropOptionsToApiPropertyOptions(SHERIFF_GAME_OPTIONS_FIELDS_SPECS.electedAt),
  },
  hasDoubledVote: {
    description: "If set to `true`, `sheriff` vote during the village's vote is doubled, otherwise, it's a regular vote",
    ...convertMongoosePropOptionsToApiPropertyOptions(SHERIFF_GAME_OPTIONS_FIELDS_SPECS.hasDoubledVote),
  },
  mustSettleTieInVotes: {
    description: "If set to `true`, in case of a tie in votes, the sheriff will have to settle the tie by choosing the player to kill between the tied players. Otherwise, there will be another vote between the tied players",
    ...convertMongoosePropOptionsToApiPropertyOptions(SHERIFF_GAME_OPTIONS_FIELDS_SPECS.mustSettleTieInVotes),
  },
};

export {
  SHERIFF_GAME_OPTIONS_API_PROPERTIES,
  SHERIFF_GAME_OPTIONS_FIELDS_SPECS,
};