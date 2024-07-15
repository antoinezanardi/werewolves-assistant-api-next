import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

import { VOTES_GAME_OPTIONS_API_PROPERTIES, VOTES_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/votes-game-options/votes-game-options.schema.constants";

class CreateVotesGameOptionsDto {
  @ApiProperty({
    ...VOTES_GAME_OPTIONS_API_PROPERTIES.canBeSkipped,
    required: false,
  } as ApiPropertyOptions)
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public canBeSkipped: boolean = VOTES_GAME_OPTIONS_FIELDS_SPECS.canBeSkipped.default;

  @ApiProperty({
    ...VOTES_GAME_OPTIONS_API_PROPERTIES.duration,
    required: false,
  } as ApiPropertyOptions)
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(VOTES_GAME_OPTIONS_FIELDS_SPECS.duration.min)
  @Max(VOTES_GAME_OPTIONS_FIELDS_SPECS.duration.max)
  public duration: number = VOTES_GAME_OPTIONS_FIELDS_SPECS.duration.default;
}

export { CreateVotesGameOptionsDto };