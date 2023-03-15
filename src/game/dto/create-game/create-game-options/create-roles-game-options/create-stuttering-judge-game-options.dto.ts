import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { stutteringJudgeGameOptionsApiProperties, stutteringJudgeGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/stuttering-judge-game-options.constant";

class CreateStutteringJudgeGameOptionsDto {
  @ApiProperty(stutteringJudgeGameOptionsApiProperties.voteRequestsCount)
  @IsOptional()
  @Min(stutteringJudgeGameOptionsFieldsSpecs.voteRequestsCount.minimum)
  @Max(stutteringJudgeGameOptionsFieldsSpecs.voteRequestsCount.maximum)
  public voteRequestsCount?: number;
}

export { CreateStutteringJudgeGameOptionsDto };