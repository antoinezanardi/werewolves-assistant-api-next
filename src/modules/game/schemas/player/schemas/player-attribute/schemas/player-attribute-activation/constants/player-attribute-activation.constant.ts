import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { PlayerAttributeActivation } from "../schemas/player-attribute-activation.schema";

const playerAttributeActivationFieldsSpecs = Object.freeze({ turn: { minimum: 1 } });

const playerAttributeActivationApiProperties: Record<keyof PlayerAttributeActivation, ApiPropertyOptions> = Object.freeze({
  turn: {
    description: "From which game's turn the attribute will become active",
    ...playerAttributeActivationFieldsSpecs.turn,
  },
  phase: { description: "From which game turn's phase (`day` or `night`) the attribute will become active" },
});

export { playerAttributeActivationFieldsSpecs, playerAttributeActivationApiProperties };