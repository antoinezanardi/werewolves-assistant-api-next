import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { gameOptionsApiProperties } from "../../../constants/game-options/game-options.constant";
import { CreateCompositionGameOptionsDto } from "./create-composition-game-options/create-composition-game-options.dto";
import { CreateRolesGameOptionsDto } from "./create-roles-game-options/create-roles-game-options.dto";
import { CreateVotesGameOptionsDto } from "./create-votes-game-options/create-votes-game-options.dto";

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
    ...gameOptionsApiProperties.votes,
    required: false,
  })
  @IsOptional()
  @Type(() => CreateVotesGameOptionsDto)
  @ValidateNested()
  public votes: CreateVotesGameOptionsDto = new CreateVotesGameOptionsDto();

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