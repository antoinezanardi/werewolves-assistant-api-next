import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import type { InteractablePlayer } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/interactable-player.schema";
import { PLAYER_INTERACTION_SCHEMA } from "@/modules/game/schemas/game-play/game-play-eligible-targets/interactable-player/player-interaction/player-interaction.schema";
import { PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";

import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const INTERACTABLE_PLAYER_SPECS_FIELDS = {
  player: {
    required: true,
    type: PLAYER_SCHEMA,
  },
  interactions: {
    required: true,
    type: [PLAYER_INTERACTION_SCHEMA],
    minItems: 1,
  },
} as const satisfies Record<keyof InteractablePlayer, MongoosePropOptions>;

const INTERACTABLE_PLAYER_API_PROPERTIES: ReadonlyDeep<Record<keyof InteractablePlayer, ApiPropertyOptions>> = {
  player: {
    description: "Player you can interact with",
    ...INTERACTABLE_PLAYER_SPECS_FIELDS.player,
  },
  interactions: {
    description: "Interactions that can be performed on the player",
    ...INTERACTABLE_PLAYER_SPECS_FIELDS.interactions,
  },
};

export {
  INTERACTABLE_PLAYER_SPECS_FIELDS,
  INTERACTABLE_PLAYER_API_PROPERTIES,
};