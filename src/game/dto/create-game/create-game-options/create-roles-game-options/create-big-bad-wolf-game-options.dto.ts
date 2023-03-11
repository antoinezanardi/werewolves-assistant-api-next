import { IsOptional } from "class-validator";

class CreateBigBadWolfGameOptionsDto {
  @IsOptional()
  public isPowerlessIfWerewolfDies?: boolean;
}

export { CreateBigBadWolfGameOptionsDto };