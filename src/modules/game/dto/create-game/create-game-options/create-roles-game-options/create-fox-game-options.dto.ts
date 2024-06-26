import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { FOX_GAME_OPTIONS_API_PROPERTIES, FOX_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/fox-game-options/fox-game-options.schema.constants";

class CreateFoxGameOptionsDto {
  @ApiProperty({
    ...FOX_GAME_OPTIONS_API_PROPERTIES.isPowerlessIfMissesWerewolf,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isPowerlessIfMissesWerewolf: boolean = FOX_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfMissesWerewolf.default;
}

export { CreateFoxGameOptionsDto };