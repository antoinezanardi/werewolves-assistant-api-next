import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

import { ELDER_GAME_OPTIONS_API_PROPERTIES, ELDER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/elder-game-options/elder-game-options.schema.constants";

class CreateElderGameOptionsDto {
  @ApiProperty({
    ...ELDER_GAME_OPTIONS_API_PROPERTIES.livesCountAgainstWerewolves,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsInt()
  @Min(ELDER_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.min)
  @Max(ELDER_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.max)
  public livesCountAgainstWerewolves: number = ELDER_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.default;

  @ApiProperty({
    ...ELDER_GAME_OPTIONS_API_PROPERTIES.doesTakeHisRevenge,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public doesTakeHisRevenge: boolean = ELDER_GAME_OPTIONS_FIELDS_SPECS.doesTakeHisRevenge.default;
}

export { CreateElderGameOptionsDto };