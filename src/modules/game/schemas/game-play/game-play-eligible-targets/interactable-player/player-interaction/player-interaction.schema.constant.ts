import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { GAME_SOURCES } from "@/modules/game/constants/game.constant";
import { PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import type { PlayerInteraction } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/player-interaction/player-interaction.schema";

import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const PLAYER_INTERACTION_SPECS_FIELDS = {
  source: {
    required: true,
    enum: GAME_SOURCES,
  },
  type: {
    required: true,
    enum: Object.values(PlayerInteractionTypes),
  },
} as const satisfies Record<keyof PlayerInteraction, MongoosePropOptions>;

const PLAYER_INTERACTION_API_PROPERTIES: ReadonlyDeep<Record<keyof PlayerInteraction, ApiPropertyOptions>> = {
  source: {
    description: "Source which can perform the interaction",
    ...PLAYER_INTERACTION_SPECS_FIELDS.source,
  },
  type: {
    description: "Type of the interaction",
    ...PLAYER_INTERACTION_SPECS_FIELDS.type,
  },
};

export {
  PLAYER_INTERACTION_SPECS_FIELDS,
  PLAYER_INTERACTION_API_PROPERTIES,
};