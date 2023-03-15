import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { TwoSistersGameOptions } from "../../schemas/roles-game-options/two-sisters-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const twoSistersGameOptionsFieldsSpecs = Object.freeze({
  wakingUpInterval: {
    default: defaultGameOptions.roles.twoSisters.wakingUpInterval,
    minimum: 0,
    maximum: 5,
  },
});

const twoSistersGameOptionsApiProperties: Record<keyof TwoSistersGameOptions, ApiPropertyOptions> = Object.freeze({
  wakingUpInterval: {
    description: "Since the first `night`, interval of `nights` when the `two sisters` are waking up. In other words, they wake up every other night if value is `1`. If set to `0`, they are waking up the first night only",
    ...twoSistersGameOptionsFieldsSpecs.wakingUpInterval,
  },
});

export { twoSistersGameOptionsApiProperties, twoSistersGameOptionsFieldsSpecs };