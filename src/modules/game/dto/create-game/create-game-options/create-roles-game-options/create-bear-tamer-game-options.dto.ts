import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES, BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/bear-tamer-game-options/bear-tamer-game-options.schema.constant";

class CreateBearTamerGameOptionsDto {
  @ApiProperty({
    ...BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES.doesGrowlIfInfected,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public doesGrowlIfInfected: boolean = BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS.doesGrowlIfInfected.default;
}

export { CreateBearTamerGameOptionsDto };