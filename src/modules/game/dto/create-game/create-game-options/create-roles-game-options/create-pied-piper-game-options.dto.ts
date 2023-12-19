import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

import { PIED_PIPER_GAME_OPTIONS_API_PROPERTIES, PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/pied-piper-game-options/pied-piper-game-options.schema.constant";

class CreatePiedPiperGameOptionsDto {
  @ApiProperty({
    ...PIED_PIPER_GAME_OPTIONS_API_PROPERTIES.charmedPeopleCountPerNight,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsInt()
  @Min(PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight.min)
  @Max(PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight.max)
  public charmedPeopleCountPerNight: number = PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight.default;

  @ApiProperty({
    ...PIED_PIPER_GAME_OPTIONS_API_PROPERTIES.isPowerlessOnWerewolvesSide,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isPowerlessOnWerewolvesSide: boolean = PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.isPowerlessOnWerewolvesSide.default;
}

export { CreatePiedPiperGameOptionsDto };