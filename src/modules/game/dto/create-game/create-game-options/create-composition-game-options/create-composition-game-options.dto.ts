import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

import { COMPOSITION_GAME_OPTIONS_API_PROPERTIES, COMPOSITION_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/composition-game-options/composition-game-options.schema.constant";

class CreateCompositionGameOptionsDto {
  @ApiProperty({
    ...COMPOSITION_GAME_OPTIONS_API_PROPERTIES.isHidden,
    required: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public isHidden: boolean = COMPOSITION_GAME_OPTIONS_FIELDS_SPECS.isHidden.default;
}

export { CreateCompositionGameOptionsDto };