import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { WILD_CHILD_GAME_OPTIONS_API_PROPERTIES, WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/wild-child-game-options.constant";

class CreateWildChildGameOptionsDto {
  @ApiProperty({
    ...WILD_CHILD_GAME_OPTIONS_API_PROPERTIES.isTransformationRevealed,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isTransformationRevealed: boolean = WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS.isTransformationRevealed.default;
}

export { CreateWildChildGameOptionsDto };