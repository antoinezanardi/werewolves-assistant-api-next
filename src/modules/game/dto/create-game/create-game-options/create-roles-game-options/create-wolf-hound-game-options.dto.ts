import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { WOLF_HOUND_GAME_OPTIONS_API_PROPERTIES, WOLF_HOUND_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/wolf-hound-game-options/wolf-hound-game-options.schema.constant";

class CreateWolfHoundGameOptionsDto {
  @ApiProperty({
    ...WOLF_HOUND_GAME_OPTIONS_API_PROPERTIES.isChosenSideRevealed,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isChosenSideRevealed: boolean = WOLF_HOUND_GAME_OPTIONS_FIELDS_SPECS.isChosenSideRevealed.default;

  @ApiProperty({
    ...WOLF_HOUND_GAME_OPTIONS_API_PROPERTIES.isSideRandomlyChosen,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isSideRandomlyChosen: boolean = WOLF_HOUND_GAME_OPTIONS_FIELDS_SPECS.isSideRandomlyChosen.default;
}

export { CreateWolfHoundGameOptionsDto };