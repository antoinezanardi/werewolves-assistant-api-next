import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { gameOptionsApiProperties } from "../../../schemas/game-options/constants/game-options.constant";
import { CreateCompositionGameOptionsDto } from "./create-composition-game-options/create-composition-game-options.dto";
import { CreateRolesGameOptionsDto } from "./create-roles-game-options/create-roles-game-options.dto";

class CreateGameOptionsDto {
  @ApiProperty(gameOptionsApiProperties.composition)
  @Type(() => CreateCompositionGameOptionsDto)
  @ValidateNested()
  public composition: CreateCompositionGameOptionsDto;

  @ApiProperty(gameOptionsApiProperties.roles)
  @IsOptional()
  public roles?: CreateRolesGameOptionsDto;
}

export { CreateGameOptionsDto };