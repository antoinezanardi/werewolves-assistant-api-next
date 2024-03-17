import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { CUPID_LOVERS_GAME_OPTIONS_API_PROPERTIES, CUPID_LOVERS_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/cupid-game-options/cupid-lovers-game-options/cupid-game-options.schema.constants";

class CreateCupidLoversGameOptionsDto {
  @ApiProperty({
    ...CUPID_LOVERS_GAME_OPTIONS_API_PROPERTIES.doRevealRoleToEachOther,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public doRevealRoleToEachOther: boolean = CUPID_LOVERS_GAME_OPTIONS_FIELDS_SPECS.doRevealRoleToEachOther.default;
}

export { CreateCupidLoversGameOptionsDto };