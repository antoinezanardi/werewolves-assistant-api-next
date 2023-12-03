import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";

import { CreateCupidLoversGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-roles-game-options/create-cupid-game-options/create-cupid-lovers-game-options.dto";
import { CUPID_GAME_OPTIONS_API_PROPERTIES } from "@/modules/game/schemas/game-options/roles-game-options/cupid-game-options/cupid-game-options.schema.constant";

class CreateCupidGameOptionsDto {
  @ApiProperty({
    ...CUPID_GAME_OPTIONS_API_PROPERTIES.lovers,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @Type(() => CreateCupidLoversGameOptionsDto)
  @ValidateNested()
  public lovers: CreateCupidLoversGameOptionsDto = new CreateCupidLoversGameOptionsDto();
}

export { CreateCupidGameOptionsDto };