import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { IDIOT_GAME_OPTIONS_API_PROPERTIES, IDIOT_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/idiot-game-options/idiot-game-options.schema.constants";

class CreateIdiotGameOptionsDto {
  @ApiProperty({
    ...IDIOT_GAME_OPTIONS_API_PROPERTIES.doesDieOnElderDeath,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public doesDieOnElderDeath: boolean = IDIOT_GAME_OPTIONS_FIELDS_SPECS.doesDieOnElderDeath.default;
}

export { CreateIdiotGameOptionsDto };