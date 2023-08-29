import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { THREE_BROTHERS_GAME_OPTIONS_API_PROPERTIES, THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/three-brothers-game-options.constant";

class CreateThreeBrothersGameOptionsDto {
  @ApiProperty({
    ...THREE_BROTHERS_GAME_OPTIONS_API_PROPERTIES.wakingUpInterval,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.minimum)
  @Max(THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.maximum)
  public wakingUpInterval: number = THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.default;
}

export { CreateThreeBrothersGameOptionsDto };