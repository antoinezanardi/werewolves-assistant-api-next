import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { DOG_WOLF_GAME_OPTIONS_API_PROPERTIES } from "@/modules/game/constants/game-options/roles-game-options/dog-wolf-game-options.constant";
import { WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/wild-child-game-options.constant";

class CreateDogWolfGameOptionsDto {
  @ApiProperty({
    ...DOG_WOLF_GAME_OPTIONS_API_PROPERTIES.isChosenSideRevealed,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isChosenSideRevealed: boolean = WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS.isTransformationRevealed.default;
}

export { CreateDogWolfGameOptionsDto };