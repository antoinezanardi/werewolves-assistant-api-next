import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_PHASE_NAMES } from "@/modules/game/constants/game-phase/game-phase.constants";
import type { PlayerAttributeActivation } from "@/modules/game/schemas/player/player-attribute/player-attribute-activation/player-attribute-activation.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS = {
  turn: {
    required: true,
    min: 1,
  },
  phaseName: {
    required: true,
    enum: GAME_PHASE_NAMES,
  },
} as const satisfies Record<keyof PlayerAttributeActivation, MongoosePropOptions>;

const PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES: ReadonlyDeep<Record<keyof PlayerAttributeActivation, ApiPropertyOptions>> = {
  turn: {
    description: "From which game's turn the attribute will become active",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS.turn),
  },
  phaseName: {
    description: "From which game turn's phase (`day` or `night`) the attribute will become active",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS.phaseName),
  },
};

export {
  PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS,
  PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES,
};