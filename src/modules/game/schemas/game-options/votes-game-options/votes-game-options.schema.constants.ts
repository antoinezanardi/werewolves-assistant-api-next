import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constants";
import type { VotesGameOptions } from "@/modules/game/schemas/game-options/votes-game-options/votes-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helpers";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const VOTES_GAME_OPTIONS_FIELDS_SPECS = {
  canBeSkipped: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.votes.canBeSkipped,
  },
  duration: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.votes.duration,
    min: 10,
    max: 600,
  },
} as const satisfies Record<keyof VotesGameOptions, MongoosePropOptions>;

const VOTES_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof VotesGameOptions, ApiPropertyOptions>> = {
  canBeSkipped: {
    description: "If set to `true`, players are not obliged to vote. There won't be any death if votes are skipped. Sheriff election nor votes because of the angel presence can't be skipped",
    ...convertMongoosePropOptionsToApiPropertyOptions(VOTES_GAME_OPTIONS_FIELDS_SPECS.canBeSkipped),
  },

  duration: {
    description: "Duration of the votes play in seconds. It doesn't lock in the votes, it only helps the game master to know when to stop the votes play. Vote play can be submitted before the end of the duration.",
    ...convertMongoosePropOptionsToApiPropertyOptions(VOTES_GAME_OPTIONS_FIELDS_SPECS.duration),
  },
};

export {
  VOTES_GAME_OPTIONS_API_PROPERTIES,
  VOTES_GAME_OPTIONS_FIELDS_SPECS,
};