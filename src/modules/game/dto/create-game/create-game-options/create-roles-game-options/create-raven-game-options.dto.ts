import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { RAVEN_GAME_OPTIONS_API_PROPERTIES, RAVEN_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/raven-game-options/raven-game-options.schema.constant";

class CreateRavenGameOptionsDto {
  @ApiProperty({
    ...RAVEN_GAME_OPTIONS_API_PROPERTIES.markPenalty,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsInt()
  @Min(RAVEN_GAME_OPTIONS_FIELDS_SPECS.markPenalty.min)
  @Max(RAVEN_GAME_OPTIONS_FIELDS_SPECS.markPenalty.max)
  public markPenalty: number = RAVEN_GAME_OPTIONS_FIELDS_SPECS.markPenalty.default;
}

export { CreateRavenGameOptionsDto };