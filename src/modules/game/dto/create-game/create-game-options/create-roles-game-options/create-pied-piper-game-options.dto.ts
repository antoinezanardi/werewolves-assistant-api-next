import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

import { PIED_PIPER_GAME_OPTIONS_API_PROPERTIES, PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/pied-piper-game-options.constant";

class CreatePiedPiperGameOptionsDto {
  @ApiProperty({
    ...PIED_PIPER_GAME_OPTIONS_API_PROPERTIES.charmedPeopleCountPerNight,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight.minimum)
  @Max(PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight.maximum)
  public charmedPeopleCountPerNight: number = PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight.default;

  @ApiProperty({
    ...PIED_PIPER_GAME_OPTIONS_API_PROPERTIES.isPowerlessIfInfected,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isPowerlessIfInfected: boolean = PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfInfected.default;
}

export { CreatePiedPiperGameOptionsDto };