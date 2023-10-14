import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { GAME_OPTIONS_API_PROPERTIES } from "@/modules/game/schemas/game-options/game-options.schema.constant";
import { CreateCompositionGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-composition-game-options/create-composition-game-options.dto";
import { CreateRolesGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-roles-game-options.dto";
import { CreateVotesGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-votes-game-options/create-votes-game-options.dto";

class CreateGameOptionsDto {
  @ApiProperty({
    ...GAME_OPTIONS_API_PROPERTIES.composition,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateCompositionGameOptionsDto)
  @ValidateNested()
  public composition: CreateCompositionGameOptionsDto = new CreateCompositionGameOptionsDto();

  @ApiProperty({
    ...GAME_OPTIONS_API_PROPERTIES.votes,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateVotesGameOptionsDto)
  @ValidateNested()
  public votes: CreateVotesGameOptionsDto = new CreateVotesGameOptionsDto();

  @ApiProperty({
    ...GAME_OPTIONS_API_PROPERTIES.roles,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateRolesGameOptionsDto)
  @ValidateNested()
  public roles: CreateRolesGameOptionsDto = new CreateRolesGameOptionsDto();
}

export { CreateGameOptionsDto };