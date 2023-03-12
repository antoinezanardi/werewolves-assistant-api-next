import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ThreeBrothersGameOptions } from "../../schemas/roles-game-options/three-brothers-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const threeBrothersGameOptionsApiProperties: Record<keyof ThreeBrothersGameOptions, ApiPropertyOptions> = Object.freeze({
  wakingUpInterval: {
    description: "Since first `night`, interval of `nights` when the `three brothers` are waking up. In other words, they wake up every other night if value is `1`. If set to `0`, they are waking up the first night only",
    default: defaultGameOptions.roles.threeBrothers.wakingUpInterval,
    minimum: 0,
    maximum: 5,
  },
});

export { threeBrothersGameOptionsApiProperties };