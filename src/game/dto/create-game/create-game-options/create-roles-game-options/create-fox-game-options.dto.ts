import { IsOptional } from "class-validator";

class CreateFoxGameOptionsDto {
  @IsOptional()
  public isPowerlessIfMissesWerewolf?: boolean;
}

export { CreateFoxGameOptionsDto };