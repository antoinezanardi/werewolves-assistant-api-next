import type { ApiPropertyOptions } from "@nestjs/swagger";
import type { StutteringJudgeGameOptions } from "../../schemas/roles-game-options/stuttering-judge-game-options.schema";
import { defaultGameOptions } from "../game-options.constant";

const stutteringJudgeGameOptionsApiProperties: Record<keyof StutteringJudgeGameOptions, ApiPropertyOptions> = Object.freeze({
  voteRequestsCount: {
    description: "Number of vote requests that the `stuttering judge` can make during the game",
    default: defaultGameOptions.roles.stutteringJudge.voteRequestsCount,
    minimum: 1,
    maximum: 5,
  },
});

export { stutteringJudgeGameOptionsApiProperties };