import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { VotesGameOptions } from "../../schemas/game-options/votes-game-options.schema";
import { defaultGameOptions } from "./game-options.constant";

const votesGameOptionsFieldsSpecs = Object.freeze({ canBeSkipped: { default: defaultGameOptions.votes.canBeSkipped } });

const votesGameOptionsApiProperties: Record<keyof VotesGameOptions, ApiPropertyOptions> = Object.freeze({
  canBeSkipped: {
    description: "If set to `true`, players are not obliged to vote. There won't be any death if votes are skipped. Sheriff election nor votes because of the angel presence can't be skipped",
    ...votesGameOptionsFieldsSpecs.canBeSkipped,
  },
});

export {
  votesGameOptionsApiProperties,
  votesGameOptionsFieldsSpecs,
};