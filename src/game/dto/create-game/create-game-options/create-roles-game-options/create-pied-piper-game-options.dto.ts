import { IsOptional, Max, Min } from "class-validator";

class CreatePiedPiperGameOptionsDto {
  @IsOptional()
  public isPowerlessIfInfected?: boolean;

  @IsOptional()
  @Min(1)
  @Max(5)
  public charmedPeopleCountPerNight?: number;
}

export { CreatePiedPiperGameOptionsDto };