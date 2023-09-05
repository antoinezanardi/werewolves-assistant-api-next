import type { ApiPropertyOptions } from "@nestjs/swagger";

import type { PlayerAttributeActivation } from "@/modules/game/schemas/player/player-attribute/player-attribute-activation.schema";

const PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS = Object.freeze({ turn: { minimum: 1 } });

const PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES: Record<keyof PlayerAttributeActivation, ApiPropertyOptions> = Object.freeze({
  turn: {
    description: "From which game's turn the attribute will become active",
    ...PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS.turn,
  },
  phase: { description: "From which game turn's phase (`day` or `night`) the attribute will become active" },
});

export {
  PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS,
  PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES,
};