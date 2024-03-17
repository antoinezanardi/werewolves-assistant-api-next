import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { THREE_BROTHERS_GAME_OPTIONS_API_PROPERTIES, THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/three-brothers-game-options/three-brothers-game-options.schema.constants";

class CreateThreeBrothersGameOptionsDto {
  @ApiProperty({
    ...THREE_BROTHERS_GAME_OPTIONS_API_PROPERTIES.wakingUpInterval,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsInt()
  @Min(THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.min)
  @Max(THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.max)
  public wakingUpInterval: number = THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.default;
}

export { CreateThreeBrothersGameOptionsDto };