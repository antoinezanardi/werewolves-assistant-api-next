import { IsOptional } from "class-validator";

class CreateCompositionGameOptionsDto {
  @IsOptional()
  public isHidden?: boolean;
}

export { CreateCompositionGameOptionsDto };