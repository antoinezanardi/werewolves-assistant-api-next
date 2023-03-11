import { IsOptional } from "class-validator";

class CreateSeerGameOptionsDto {
  @IsOptional()
  public isTalkative?: boolean;

  @IsOptional()
  public canSeeRoles?: boolean;
}

export { CreateSeerGameOptionsDto };