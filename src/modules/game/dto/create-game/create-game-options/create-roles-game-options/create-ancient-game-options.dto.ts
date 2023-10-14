import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

import { ANCIENT_GAME_OPTIONS_API_PROPERTIES, ANCIENT_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/ancient-game-options/ancient-game-options.schema.constant";

class CreateAncientGameOptionsDto {
  @ApiProperty({
    ...ANCIENT_GAME_OPTIONS_API_PROPERTIES.livesCountAgainstWerewolves,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsInt()
  @Min(ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.min)
  @Max(ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.max)
  public livesCountAgainstWerewolves: number = ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.default;

  @ApiProperty({
    ...ANCIENT_GAME_OPTIONS_API_PROPERTIES.doesTakeHisRevenge,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public doesTakeHisRevenge: boolean = ANCIENT_GAME_OPTIONS_FIELDS_SPECS.doesTakeHisRevenge.default;
}

export { CreateAncientGameOptionsDto };