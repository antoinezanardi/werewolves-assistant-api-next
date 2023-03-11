import { IsOptional, Max, Min } from "class-validator";

class CreateThreeBrothersGameOptionsDto {
  @IsOptional()
  @Min(0)
  @Max(5)
  public wakingUpInterval?: number;
}

export { CreateThreeBrothersGameOptionsDto };