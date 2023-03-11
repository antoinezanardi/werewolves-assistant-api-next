import { IsOptional } from "class-validator";

class CreateWildChildGameOptionsDto {
  @IsOptional()
  public isTransformationRevealed?: boolean;
}

export { CreateWildChildGameOptionsDto };