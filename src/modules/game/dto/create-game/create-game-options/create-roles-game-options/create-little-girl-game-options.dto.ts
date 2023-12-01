import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { LITTLE_GIRL_GAME_OPTIONS_API_PROPERTIES, LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS } from "@/modules/game/schemas/game-options/roles-game-options/little-girl-game-options/little-girl-game-options.schema.constant";

class CreateLittleGirlGameOptionsDto {
  @ApiProperty({
    ...LITTLE_GIRL_GAME_OPTIONS_API_PROPERTIES.isProtectedByDefender,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isProtectedByDefender: boolean = LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS.isProtectedByDefender.default;
}

export { CreateLittleGirlGameOptionsDto };