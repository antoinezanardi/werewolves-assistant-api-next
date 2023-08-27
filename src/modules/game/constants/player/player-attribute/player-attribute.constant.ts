
import type { ApiPropertyOptions } from "@nestjs/swagger";

import { gameSourceValues } from "@/modules/game/constants/game.constant";
import type { PlayerAttribute } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema";

const playerAttributeFieldsSpecs = Object.freeze({
  remainingPhases: { minimum: 1 },
  doesRemainAfterDeath: { default: false },
});

const playerAttributeApiProperties: Record<keyof PlayerAttribute, ApiPropertyOptions> = Object.freeze({
  name: { description: "Attribute's name on the player." },
  source: {
    description: "Which entity gave this attribute to the player",
    enum: gameSourceValues,
  },
  remainingPhases: {
    description: "Remaining time for this attribute before disappear. If not set, the attribute will remain forever on the player. Else, decreases after each `phase` if `activeAt` conditions are met or if `activeAt` is not set",
    ...playerAttributeFieldsSpecs.remainingPhases,
  },
  activeAt: { description: "When the attribute will become active and will have consequences on players. Used for attributes with delay. If not set, the attribute is immediately active." },
  doesRemainAfterDeath: { description: "If the attribute is removed on player's death" },
});

export { playerAttributeApiProperties, playerAttributeFieldsSpecs };