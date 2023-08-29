import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { VotesGameOptions } from "@/modules/game/schemas/game-options/votes-game-options.schema";

const VOTES_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({ canBeSkipped: { default: DEFAULT_GAME_OPTIONS.votes.canBeSkipped } });

const VOTES_GAME_OPTIONS_API_PROPERTIES: Record<keyof VotesGameOptions, ApiPropertyOptions> = Object.freeze({
  canBeSkipped: {
    description: "If set to `true`, players are not obliged to vote. There won't be any death if votes are skipped. Sheriff election nor votes because of the angel presence can't be skipped",
    ...VOTES_GAME_OPTIONS_FIELDS_SPECS.canBeSkipped,
  },
});

export {
  VOTES_GAME_OPTIONS_API_PROPERTIES,
  VOTES_GAME_OPTIONS_FIELDS_SPECS,
};