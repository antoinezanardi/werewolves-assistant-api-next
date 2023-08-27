import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { VotesGameOptions } from "@/modules/game/schemas/game-options/votes-game-options.schema";

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