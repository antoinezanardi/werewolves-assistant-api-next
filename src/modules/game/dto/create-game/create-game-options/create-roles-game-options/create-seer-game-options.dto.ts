import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { SEER_GAME_OPTIONS_API_PROPERTIES, SEER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/seer-game-options/seer-game-options.schema.constant";

class CreateSeerGameOptionsDto {
  @ApiProperty({
    ...SEER_GAME_OPTIONS_API_PROPERTIES.isTalkative,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isTalkative: boolean = SEER_GAME_OPTIONS_FIELDS_SPECS.isTalkative.default;

  @ApiProperty({
    ...SEER_GAME_OPTIONS_API_PROPERTIES.canSeeRoles,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public canSeeRoles: boolean = SEER_GAME_OPTIONS_FIELDS_SPECS.canSeeRoles.default;
}

export { CreateSeerGameOptionsDto };