import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { GUARD_GAME_OPTIONS_API_PROPERTIES, GUARD_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/guard-game-options/guard-game-options.schema.constant";

class CreateGuardGameOptionsDto {
  @ApiProperty({
    ...GUARD_GAME_OPTIONS_API_PROPERTIES.canProtectTwice,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public canProtectTwice: boolean = GUARD_GAME_OPTIONS_FIELDS_SPECS.canProtectTwice.default;
}

export { CreateGuardGameOptionsDto };