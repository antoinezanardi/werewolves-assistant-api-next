import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { TWO_SISTERS_GAME_OPTIONS_API_PROPERTIES, TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/two-sisters-game-options/two-sisters-game-options.schema.constants";

class CreateTwoSistersGameOptionsDto {
  @ApiProperty({
    ...TWO_SISTERS_GAME_OPTIONS_API_PROPERTIES.wakingUpInterval,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsInt()
  @Min(TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.min)
  @Max(TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.max)
  public wakingUpInterval: number = TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.default;
}

export { CreateTwoSistersGameOptionsDto };