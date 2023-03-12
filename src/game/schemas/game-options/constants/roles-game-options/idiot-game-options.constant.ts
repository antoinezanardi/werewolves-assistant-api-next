import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { IdiotGameOptions } from "../../schemas/roles-game-options/idiot-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const idiotGameOptionsApiProperties: Record<keyof IdiotGameOptions, ApiPropertyOptions> = Object.freeze({
  doesDieOnAncientDeath: {
    description: "If set to `true`, the idiot will die if his role is revealed and the ancient just died",
    default: defaultGameOptions.roles.idiot.doesDieOnAncientDeath,
  },
});

export { idiotGameOptionsApiProperties };