import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GamePhases } from "@/modules/game/enums/game.enum";
import type { PlayerAttributeActivation } from "@/modules/game/schemas/player/player-attribute/player-attribute-activation/player-attribute-activation.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS = {
  turn: {
    required: true,
    min: 1,
  },
  phase: {
    required: true,
    enum: Object.values(GamePhases),
  },
} as const satisfies Record<keyof PlayerAttributeActivation, MongoosePropOptions>;

const PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES: ReadonlyDeep<Record<keyof PlayerAttributeActivation, ApiPropertyOptions>> = {
  turn: {
    description: "From which game's turn the attribute will become active",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS.turn),
  },
  phase: {
    description: "From which game turn's phase (`day` or `night`) the attribute will become active",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS.phase),
  },
};

export {
  PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS,
  PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES,
};