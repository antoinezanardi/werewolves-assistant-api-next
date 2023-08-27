import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

import { compositionGameOptionsApiProperties, compositionGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/composition-game-options.constant";

class CreateCompositionGameOptionsDto {
  @ApiProperty({
    ...compositionGameOptionsApiProperties.isHidden,
    required: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public isHidden: boolean = compositionGameOptionsFieldsSpecs.isHidden.default;
}

export { CreateCompositionGameOptionsDto };