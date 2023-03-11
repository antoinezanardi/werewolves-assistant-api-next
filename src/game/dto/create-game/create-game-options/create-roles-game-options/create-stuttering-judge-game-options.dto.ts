import { IsOptional, Max, Min } from "class-validator";

class CreateStutteringJudgeGameOptionsDto {
  @IsOptional()
  @Min(1)
  @Max(5)
  public voteRequestsCount?: number;
}

export { CreateStutteringJudgeGameOptionsDto };