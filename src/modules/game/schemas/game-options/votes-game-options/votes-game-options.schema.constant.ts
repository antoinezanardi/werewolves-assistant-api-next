import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { VotesGameOptions } from "@/modules/game/schemas/game-options/votes-game-options/votes-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const VOTES_GAME_OPTIONS_FIELDS_SPECS = {
  canBeSkipped: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.votes.canBeSkipped,
  },
} as const satisfies Record<keyof VotesGameOptions, MongoosePropOptions>;

const VOTES_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof VotesGameOptions, ApiPropertyOptions>> = {
  canBeSkipped: {
    description: "If set to `true`, players are not obliged to vote. There won't be any death if votes are skipped. Sheriff election nor votes because of the angel presence can't be skipped",
    ...convertMongoosePropOptionsToApiPropertyOptions(VOTES_GAME_OPTIONS_FIELDS_SPECS.canBeSkipped),
  },
};

export {
  VOTES_GAME_OPTIONS_API_PROPERTIES,
  VOTES_GAME_OPTIONS_FIELDS_SPECS,
};