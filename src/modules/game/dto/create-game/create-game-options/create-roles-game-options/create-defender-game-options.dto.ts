import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { DEFENDER_GAME_OPTIONS_API_PROPERTIES, DEFENDER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/defender-game-options/defender-game-options.schema.constant";

class CreateDefenderGameOptionsDto {
  @ApiProperty({
    ...DEFENDER_GAME_OPTIONS_API_PROPERTIES.canProtectTwice,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public canProtectTwice: boolean = DEFENDER_GAME_OPTIONS_FIELDS_SPECS.canProtectTwice.default;
}

export { CreateDefenderGameOptionsDto };