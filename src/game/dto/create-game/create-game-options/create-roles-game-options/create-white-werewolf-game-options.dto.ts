import { IsOptional, Max, Min } from "class-validator";

class CreateWhiteWerewolfGameOptionsDto {
  @IsOptional()
  @Min(1)
  @Max(5)
  public wakingUpInterval?: number;
}

export { CreateWhiteWerewolfGameOptionsDto };