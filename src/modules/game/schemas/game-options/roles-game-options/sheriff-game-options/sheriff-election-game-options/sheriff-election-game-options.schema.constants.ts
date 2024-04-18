import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_PHASE_NAMES } from "@/modules/game/constants/game-phase/game-phase.constants";
import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { SheriffElectionGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/sheriff-game-options/sheriff-election-game-options/sheriff-election-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS = {
  turn: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.sheriff.electedAt.turn,
    min: 1,
  },
  phaseName: {
    required: true,
    enum: GAME_PHASE_NAMES,
    default: DEFAULT_GAME_OPTIONS.roles.sheriff.electedAt.phaseName,
  },
} as const satisfies Record<keyof SheriffElectionGameOptions, MongoosePropOptions>;

const SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof SheriffElectionGameOptions, ApiPropertyOptions>> = {
  turn: {
    description: "Game's turn when the `sheriff` is elected",
    ...convertMongoosePropOptionsToApiPropertyOptions(SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.turn),
  },
  phaseName: {
    description: "Game's phase when the `sheriff` is elected",
    ...convertMongoosePropOptionsToApiPropertyOptions(SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS.phaseName),
  },
};

export {
  SHERIFF_ELECTION_GAME_OPTIONS_API_PROPERTIES,
  SHERIFF_ELECTION_GAME_OPTIONS_FIELDS_SPECS,
};