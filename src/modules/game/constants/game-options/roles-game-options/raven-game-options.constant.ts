import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { RavenGameOptions } from "../../../schemas/game-options/roles-game-options/raven-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const ravenGameOptionsFieldsSpecs = Object.freeze({
  markPenalty: {
    default: defaultGameOptions.roles.raven.markPenalty,
    minimum: 1,
    maximum: 5,
  },
});

const ravenGameOptionsApiProperties: Record<keyof RavenGameOptions, ApiPropertyOptions> = Object.freeze({
  markPenalty: {
    description: "Penalty of votes against the player targeted by the `raven mark` for the next village's vote. In other words, the `raven marked` player will have two votes against himself if this value is set to `2`",
    ...ravenGameOptionsFieldsSpecs.markPenalty,
  },
});

export { ravenGameOptionsApiProperties, ravenGameOptionsFieldsSpecs };