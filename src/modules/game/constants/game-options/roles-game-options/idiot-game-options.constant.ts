import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { IdiotGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/idiot-game-options.schema";

const idiotGameOptionsFieldsSpecs = Object.freeze({ doesDieOnAncientDeath: { default: defaultGameOptions.roles.idiot.doesDieOnAncientDeath } });

const idiotGameOptionsApiProperties: Record<keyof IdiotGameOptions, ApiPropertyOptions> = Object.freeze({
  doesDieOnAncientDeath: {
    description: "If set to `true`, the idiot will die if his role is revealed and the ancient just died",
    ...idiotGameOptionsFieldsSpecs.doesDieOnAncientDeath,
  },
});

export { idiotGameOptionsApiProperties, idiotGameOptionsFieldsSpecs };