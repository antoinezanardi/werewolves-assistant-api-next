import type { ApiPropertyOptions } from "@nestjs/swagger";

import { GAME_SOURCES } from "@/modules/game/constants/game.constant";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";

const PLAYER_ATTRIBUTE_FIELDS_SPECS = Object.freeze({
  remainingPhases: { minimum: 1 },
  doesRemainAfterDeath: { default: false },
});

const PLAYER_ATTRIBUTE_API_PROPERTIES: Record<keyof PlayerAttribute, ApiPropertyOptions> = Object.freeze({
  name: { description: "Attribute's name on the player." },
  source: {
    description: "Which entity gave this attribute to the player",
    enum: GAME_SOURCES,
  },
  remainingPhases: {
    description: "Remaining time for this attribute before disappear. If not set, the attribute will remain forever on the player. Else, decreases after each `phase` if `activeAt` conditions are met or if `activeAt` is not set",
    ...PLAYER_ATTRIBUTE_FIELDS_SPECS.remainingPhases,
  },
  activeAt: { description: "When the attribute will become active and will have consequences on players. Used for attributes with delay. If not set, the attribute is immediately active." },
  doesRemainAfterDeath: { description: "If the attribute is removed on player's death" },
});

export {
  PLAYER_ATTRIBUTE_API_PROPERTIES,
  PLAYER_ATTRIBUTE_FIELDS_SPECS,
};