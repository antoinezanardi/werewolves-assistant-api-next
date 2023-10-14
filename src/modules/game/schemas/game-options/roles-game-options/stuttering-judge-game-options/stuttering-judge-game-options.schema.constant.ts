import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { ReadonlyDeep } from "type-fest";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { StutteringJudgeGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/stuttering-judge-game-options/stuttering-judge-game-options.schema";

import { convertMongoosePropOptionsToApiPropertyOptions } from "@/shared/api/helpers/api.helper";
import type { MongoosePropOptions } from "@/shared/mongoose/types/mongoose.types";

const STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS = {
  voteRequestsCount: {
    required: true,
    default: DEFAULT_GAME_OPTIONS.roles.stutteringJudge.voteRequestsCount,
    min: 1,
    max: 5,
  },
} as const satisfies Record<keyof StutteringJudgeGameOptions, MongoosePropOptions>;

const STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES: ReadonlyDeep<Record<keyof StutteringJudgeGameOptions, ApiPropertyOptions>> = {
  voteRequestsCount: {
    description: "Number of vote requests that the `stuttering judge` can make during the game",
    ...convertMongoosePropOptionsToApiPropertyOptions(STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount),
  },
};

export {
  STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES,
  STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS,
};