import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { BIG_BAD_WOLF_GAME_OPTIONS_API_PROPERTIES, BIG_BAD_WOLF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/big-bad-wolf-game-options/big-bad-wolf-game-options.schema.constant";

class CreateBigBadWolfGameOptionsDto {
  @ApiProperty({
    ...BIG_BAD_WOLF_GAME_OPTIONS_API_PROPERTIES.isPowerlessIfWerewolfDies,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isPowerlessIfWerewolfDies: boolean = BIG_BAD_WOLF_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfWerewolfDies.default;
}

export { CreateBigBadWolfGameOptionsDto };