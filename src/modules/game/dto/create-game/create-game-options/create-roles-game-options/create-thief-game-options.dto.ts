import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

import { THIEF_GAME_OPTIONS_API_PROPERTIES, THIEF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/thief-game-options/thief-game-options.schema.constant";

class CreateThiefGameOptionsDto {
  @ApiProperty({
    ...THIEF_GAME_OPTIONS_API_PROPERTIES.mustChooseBetweenWerewolves,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public mustChooseBetweenWerewolves: boolean = THIEF_GAME_OPTIONS_FIELDS_SPECS.mustChooseBetweenWerewolves.default;

  @ApiProperty({
    ...THIEF_GAME_OPTIONS_API_PROPERTIES.additionalCardsCount,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsInt()
  @Min(THIEF_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.min)
  @Max(THIEF_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.max)
  public additionalCardsCount: number = THIEF_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.default;
}

export { CreateThiefGameOptionsDto };