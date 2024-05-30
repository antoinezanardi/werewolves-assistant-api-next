import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_PHASE_NAMES } from "@/modules/game/constants/game-phase/game-phase.constants";
import type { GamePhase } from "@/modules/game/schemas/game-phase/game-phase.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const GAME_PHASE_FIELDS_SPECS = {
  name: {
    required: true,
    enum: GAME_PHASE_NAMES,
    default: "twilight",
  },
  tick: {
    required: true,
    min: 1,
    default: 1,
  },
} as const satisfies Record<keyof GamePhase, MongoosePropOptions>;

const GAME_PHASE_API_PROPERTIES: ReadonlyDeep<Record<keyof GamePhase, ApiPropertyOptions>> = {
  name: {
    description: "Name of the phase. A turn is composed of a night and a day phase. Before the first night, there is a twilight phase in which all players awake.",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PHASE_FIELDS_SPECS.name),
  },
  tick: {
    description: "Tick of the phase, starting at 1. Reset to 1 when the phase changes",
    ...convertMongoosePropOptionsToApiPropertyOptions(GAME_PHASE_FIELDS_SPECS.name),
  },
} as const;

export {
  GAME_PHASE_FIELDS_SPECS,
  GAME_PHASE_API_PROPERTIES,
};