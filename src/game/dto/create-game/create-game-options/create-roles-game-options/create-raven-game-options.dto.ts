import { IsOptional, Max, Min } from "class-validator";

class CreateRavenGameOptionsDto {
  @IsOptional()
  @Min(1)
  @Max(5)
  public markPenalty?: number;
}

export { CreateRavenGameOptionsDto };