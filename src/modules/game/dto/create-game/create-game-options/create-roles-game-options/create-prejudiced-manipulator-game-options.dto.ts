import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { PREJUDICED_MANIPULATOR_GAME_OPTIONS_API_PROPERTIES, PREJUDICED_MANIPULATOR_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/prejudiced-manipulator-game-options/prejudiced-manipulator-game-options.schema.constants";

class CreatePrejudicedManipulatorGameOptionsDto {
  @ApiProperty({
    ...PREJUDICED_MANIPULATOR_GAME_OPTIONS_API_PROPERTIES.isPowerlessOnWerewolvesSide,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isPowerlessOnWerewolvesSide: boolean = PREJUDICED_MANIPULATOR_GAME_OPTIONS_FIELDS_SPECS.isPowerlessOnWerewolvesSide.default;
}

export { CreatePrejudicedManipulatorGameOptionsDto };