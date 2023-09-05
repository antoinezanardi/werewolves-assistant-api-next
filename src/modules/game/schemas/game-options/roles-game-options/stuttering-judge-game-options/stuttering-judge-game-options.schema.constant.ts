import type { ApiPropertyOptions } from "@nestjs/swagger";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import type { StutteringJudgeGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/stuttering-judge-game-options/stuttering-judge-game-options.schema";

const STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS = Object.freeze({
  voteRequestsCount: {
    default: DEFAULT_GAME_OPTIONS.roles.stutteringJudge.voteRequestsCount,
    minimum: 1,
    maximum: 5,
  },
});

const STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES: Record<keyof StutteringJudgeGameOptions, ApiPropertyOptions> = Object.freeze({
  voteRequestsCount: {
    description: "Number of vote requests that the `stuttering judge` can make during the game",
    ...STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount,
  },
});

export {
  STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES,
  STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS,
};