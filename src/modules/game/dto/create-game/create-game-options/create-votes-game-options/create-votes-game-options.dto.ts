import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

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
}

export { CreateVotesGameOptionsDto };