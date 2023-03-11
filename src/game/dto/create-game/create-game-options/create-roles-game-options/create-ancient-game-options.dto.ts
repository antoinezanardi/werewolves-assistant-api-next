import { IsOptional, Max, Min } from "class-validator";

class CreateAncientGameOptionsDto {
  @IsOptional()
  @Min(1)
  @Max(5)
  public livesCountAgainstWerewolves?: number;

  @IsOptional()
  public doesTakeHisRevenge?: boolean;
}

export { CreateAncientGameOptionsDto };