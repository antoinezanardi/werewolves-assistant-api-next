import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { WITCH_GAME_OPTIONS_API_PROPERTIES, WITCH_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/witch-game-options/witch-game-options.schema.constant";

class CreateWitchGameOptionsDto {
  @ApiProperty({
    ...WITCH_GAME_OPTIONS_API_PROPERTIES.doesKnowWerewolvesTargets,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public doesKnowWerewolvesTargets: boolean = WITCH_GAME_OPTIONS_FIELDS_SPECS.doesKnowWerewolvesTargets.default;
}

export { CreateWitchGameOptionsDto };