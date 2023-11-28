import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { DOG_WOLF_GAME_OPTIONS_API_PROPERTIES, DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/dog-wolf-game-options/dog-wolf-game-options.schema.constant";

class CreateDogWolfGameOptionsDto {
  @ApiProperty({
    ...DOG_WOLF_GAME_OPTIONS_API_PROPERTIES.isChosenSideRevealed,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isChosenSideRevealed: boolean = DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS.isChosenSideRevealed.default;

  @ApiProperty({
    ...DOG_WOLF_GAME_OPTIONS_API_PROPERTIES.isSideRandomlyChosen,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isSideRandomlyChosen: boolean = DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS.isSideRandomlyChosen.default;
}

export { CreateDogWolfGameOptionsDto };