import { IsOptional, Max, Min } from "class-validator";

class CreateTwoSistersGameOptionsDto {
  @IsOptional()
  @Min(0)
  @Max(5)
  public wakingUpInterval?: number;
}

export { CreateTwoSistersGameOptionsDto };