import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

import { DEFAULT_GAME_OPTIONS } from "@/modules/game/constants/game-options/game-options.constant";
import { COMPOSITION_GAME_OPTIONS_API_PROPERTIES } from "@/modules/game/schemas/game-options/composition-game-options/composition-game-options.schema.constant";

class CreateCompositionGameOptionsDto {
  @ApiProperty({
    ...COMPOSITION_GAME_OPTIONS_API_PROPERTIES.isHidden,
    required: false,
  } as ApiPropertyOptions)
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public isHidden: boolean = DEFAULT_GAME_OPTIONS.composition.isHidden;
}

export { CreateCompositionGameOptionsDto };