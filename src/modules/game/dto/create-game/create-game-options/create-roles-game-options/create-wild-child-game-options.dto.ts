import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { WILD_CHILD_GAME_OPTIONS_API_PROPERTIES, WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/wild-child-game-options/wild-child-game-options.schema.constants";

class CreateWildChildGameOptionsDto {
  @ApiProperty({
    ...WILD_CHILD_GAME_OPTIONS_API_PROPERTIES.isTransformationRevealed,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isTransformationRevealed: boolean = WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS.isTransformationRevealed.default;
}

export { CreateWildChildGameOptionsDto };