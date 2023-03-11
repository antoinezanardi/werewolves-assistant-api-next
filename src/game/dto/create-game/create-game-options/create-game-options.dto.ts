import { IsOptional } from "class-validator";
import { CreateCompositionGameOptionsDto } from "./create-composition-game-options.dto";
import { CreateRolesGameOptionsDto } from "./create-roles-game-options/create-roles-game-options.dto";

class CreateGameOptionsDto {
  @IsOptional()
  public composition?: CreateCompositionGameOptionsDto;

  @IsOptional()
  public roles?: CreateRolesGameOptionsDto;
}

export { CreateGameOptionsDto };