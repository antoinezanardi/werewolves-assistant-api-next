import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { PLAYER_ATTRIBUTE_ACTIVATION_SCHEMA } from "@/modules/game/schemas/player/player-attribute/player-attribute-activation/player-attribute-activation.schema";
import { GAME_SOURCES } from "@/modules/game/constants/game.constant";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PLAYER_ATTRIBUTE_FIELDS_SPECS = {
  name: {
    required: true,
    enum: Object.values(PlayerAttributeNames),
  },
  source: {
    required: true,
    enum: Object.values(GAME_SOURCES),
  },
  remainingPhases: {
    required: false,
    min: 1,
  },
  activeAt: {
    required: false,
    type: PLAYER_ATTRIBUTE_ACTIVATION_SCHEMA,
    default: undefined,
  },
  doesRemainAfterDeath: { required: false },
} as const satisfies Record<keyof PlayerAttribute, MongoosePropOptions>;

const PLAYER_ATTRIBUTE_API_PROPERTIES: ReadonlyDeep<Record<keyof PlayerAttribute, ApiPropertyOptions>> = {
  name: {
    description: "Attribute's name on the player.",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ATTRIBUTE_FIELDS_SPECS.name),
  },
  source: {
    description: "Which entity gave this attribute to the player",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ATTRIBUTE_FIELDS_SPECS.source),
  },
  remainingPhases: {
    description: "Remaining time for this attribute before disappear. If not set, the attribute will remain forever on the player. Else, decreases after each `phase` if `activeAt` conditions are met or if `activeAt` is not set",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ATTRIBUTE_FIELDS_SPECS.remainingPhases),
  },
  activeAt: {
    description: "When the attribute will become active and will have consequences on players. Used for attributes with delay. If not set, the attribute is immediately active.",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ATTRIBUTE_FIELDS_SPECS.activeAt),
  },
  doesRemainAfterDeath: {
    description: "If the attribute is removed on player's death",
    ...convertMongoosePropOptionsToApiPropertyOptions(PLAYER_ATTRIBUTE_FIELDS_SPECS.doesRemainAfterDeath),
  },
};

export {
  PLAYER_ATTRIBUTE_API_PROPERTIES,
  PLAYER_ATTRIBUTE_FIELDS_SPECS,
};