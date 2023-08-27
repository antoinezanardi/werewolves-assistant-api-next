import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { stutteringJudgeGameOptionsApiProperties, stutteringJudgeGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/stuttering-judge-game-options.constant";

class CreateStutteringJudgeGameOptionsDto {
  @ApiProperty({
    ...stutteringJudgeGameOptionsApiProperties.voteRequestsCount,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(stutteringJudgeGameOptionsFieldsSpecs.voteRequestsCount.minimum)
  @Max(stutteringJudgeGameOptionsFieldsSpecs.voteRequestsCount.maximum)
  public voteRequestsCount: number = stutteringJudgeGameOptionsFieldsSpecs.voteRequestsCount.default;
}

export { CreateStutteringJudgeGameOptionsDto };