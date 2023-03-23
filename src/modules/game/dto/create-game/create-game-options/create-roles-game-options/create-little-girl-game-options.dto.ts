import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { littleGirlGameOptionsApiProperties, littleGirlGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/little-girl-game-options.constant";

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