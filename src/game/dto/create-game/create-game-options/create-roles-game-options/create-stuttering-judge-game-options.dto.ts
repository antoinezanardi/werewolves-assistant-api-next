import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { stutteringJudgeGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/stuttering-judge-game-options.constant";

class CreateStutteringJudgeGameOptionsDto {
  @ApiProperty(stutteringJudgeGameOptionsApiProperties.voteRequestsCount)
  @IsOptional()
  @Min(1)
  @Max(5)
  public voteRequestsCount?: number;
}

export { CreateStutteringJudgeGameOptionsDto };