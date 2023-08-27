import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { guardGameOptionsApiProperties, guardGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/guard-game-options.constant";

class CreateGuardGameOptionsDto {
  @ApiProperty({
    ...guardGameOptionsApiProperties.canProtectTwice,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public canProtectTwice: boolean = guardGameOptionsFieldsSpecs.canProtectTwice.default;
}

export { CreateGuardGameOptionsDto };