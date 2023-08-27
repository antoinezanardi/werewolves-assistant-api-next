import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { StutteringJudgeGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/stuttering-judge-game-options.schema";

const stutteringJudgeGameOptionsFieldsSpecs = Object.freeze({
  voteRequestsCount: {
    default: defaultGameOptions.roles.stutteringJudge.voteRequestsCount,
    minimum: 1,
    maximum: 5,
  },
});

const stutteringJudgeGameOptionsApiProperties: Record<keyof StutteringJudgeGameOptions, ApiPropertyOptions> = Object.freeze({
  voteRequestsCount: {
    description: "Number of vote requests that the `stuttering judge` can make during the game",
    ...stutteringJudgeGameOptionsFieldsSpecs.voteRequestsCount,
  },
});

export { stutteringJudgeGameOptionsApiProperties, stutteringJudgeGameOptionsFieldsSpecs };