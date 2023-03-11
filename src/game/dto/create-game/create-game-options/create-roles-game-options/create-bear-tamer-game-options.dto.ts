import { IsOptional } from "class-validator";

class CreateBearTamerGameOptionsDto {
  @IsOptional()
  public doesGrowlIfInfected?: boolean;
}

export { CreateBearTamerGameOptionsDto };