import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ROLE_NAMES } from "../../../../../../role/enums/role.enum";
import { PLAYER_GROUPS } from "../../../enums/player-enum";
import { PLAYER_ATTRIBUTE_NAMES } from "../enums/player-attribute.enum";
import type { PlayerAttribute } from "../schemas/player-attribute.schema";

const playerAttributeFieldsSpecs = Object.freeze({ remainingPhases: { minimum: 1 } });

const playerAttributeApiProperties: Record<keyof PlayerAttribute, ApiPropertyOptions> = Object.freeze({
  name: { description: "Attribute's name on the player." },
  source: {
    description: "Which entity gave this attribute to the player",
    enum: [...Object.values(PLAYER_GROUPS), ...Object.values(ROLE_NAMES), PLAYER_ATTRIBUTE_NAMES.SHERIFF],
  },
  remainingPhases: {
    description: "Remaining time for this attribute before disappear. If not set, the attribute will remain forever on the player. Else, decreases after each `phase` if `activeAt` conditions are met or if `activeAt` is not set",
    ...playerAttributeFieldsSpecs.remainingPhases,
  },
  activeAt: { description: "When the attribute will become active and will have consequences on players. Used for attributes with delay. If not set, the attribute is immediately active." },
});

export { playerAttributeApiProperties, playerAttributeFieldsSpecs };