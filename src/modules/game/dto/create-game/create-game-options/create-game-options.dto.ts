import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { gameOptionsApiProperties } from "../../../schemas/game-options/constants/game-options.constant";
import { CreateCompositionGameOptionsDto } from "./create-composition-game-options/create-composition-game-options.dto";
import { CreateRolesGameOptionsDto } from "./create-roles-game-options/create-roles-game-options.dto";

class CreateGameOptionsDto {
  @ApiProperty({
    ...gameOptionsApiProperties.composition,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateCompositionGameOptionsDto)
  @ValidateNested()
  public composition: CreateCompositionGameOptionsDto = new CreateCompositionGameOptionsDto();

  @ApiProperty({
    ...gameOptionsApiProperties.roles,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateRolesGameOptionsDto)
  @ValidateNested()
  public roles: CreateRolesGameOptionsDto = new CreateRolesGameOptionsDto();
}

export { CreateGameOptionsDto };