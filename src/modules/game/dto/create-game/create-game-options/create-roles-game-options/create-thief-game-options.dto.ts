import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { THIEF_GAME_OPTIONS_API_PROPERTIES, THIEF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/thief-game-options/thief-game-options.schema.constants";

class CreateThiefGameOptionsDto {
  @ApiProperty({
    ...THIEF_GAME_OPTIONS_API_PROPERTIES.mustChooseBetweenWerewolves,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public mustChooseBetweenWerewolves: boolean = THIEF_GAME_OPTIONS_FIELDS_SPECS.mustChooseBetweenWerewolves.default;

  @ApiProperty({
    ...THIEF_GAME_OPTIONS_API_PROPERTIES.isChosenCardRevealed,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isChosenCardRevealed: boolean = THIEF_GAME_OPTIONS_FIELDS_SPECS.isChosenCardRevealed.default;
}

export { CreateThiefGameOptionsDto };