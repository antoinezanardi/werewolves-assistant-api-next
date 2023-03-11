import { IsOptional } from "class-validator";

class CreateIdiotGameOptionsDto {
  @IsOptional()
  public doesDieOnAncientDeath?: boolean;
}

export { CreateIdiotGameOptionsDto };