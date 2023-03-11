import { IsOptional } from "class-validator";

class CreateGuardGameOptionsDto {
  @IsOptional()
  public canProtectTwice?: boolean;
}

export { CreateGuardGameOptionsDto };