import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { SCANDALMONGER_GAME_OPTIONS_API_PROPERTIES, SCANDALMONGER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/scandalmonger-game-options/scandalmonger-game-options.schema.constant";

class CreateScandalmongerGameOptionsDto {
  @ApiProperty({
    ...SCANDALMONGER_GAME_OPTIONS_API_PROPERTIES.markPenalty,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsInt()
  @Min(SCANDALMONGER_GAME_OPTIONS_FIELDS_SPECS.markPenalty.min)
  @Max(SCANDALMONGER_GAME_OPTIONS_FIELDS_SPECS.markPenalty.max)
  public markPenalty: number = SCANDALMONGER_GAME_OPTIONS_FIELDS_SPECS.markPenalty.default;
}

export { CreateScandalmongerGameOptionsDto };