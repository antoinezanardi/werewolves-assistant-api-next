import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES, BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/bear-tamer-game-options/bear-tamer-game-options.schema.constants";

class CreateBearTamerGameOptionsDto {
  @ApiProperty({
    ...BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES.doesGrowlOnWerewolvesSide,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public doesGrowlOnWerewolvesSide: boolean = BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS.doesGrowlOnWerewolvesSide.default;
}

export { CreateBearTamerGameOptionsDto };