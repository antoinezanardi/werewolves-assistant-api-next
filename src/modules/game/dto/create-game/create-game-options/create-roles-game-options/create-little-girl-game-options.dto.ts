import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { littleGirlGameOptionsApiProperties, littleGirlGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/little-girl-game-options.constant";

class CreateLittleGirlGameOptionsDto {
  @ApiProperty({
    ...littleGirlGameOptionsApiProperties.isProtectedByGuard,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isProtectedByGuard: boolean = littleGirlGameOptionsFieldsSpecs.isProtectedByGuard.default;
}

export { CreateLittleGirlGameOptionsDto };