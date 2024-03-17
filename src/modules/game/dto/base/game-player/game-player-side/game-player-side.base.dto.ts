import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { PLAYER_SIDE_API_PROPERTIES } from "@/modules/game/schemas/player/player-side/player-side.schema.constants";
import { RoleSides } from "@/modules/role/enums/role.enum";

class GamePlayerSideBaseDto {
  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.original as ApiPropertyOptions)
  @IsEnum(RoleSides)
  public original: RoleSides;

  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.current as ApiPropertyOptions)
  @IsEnum(RoleSides)
  public current: RoleSides;
}

export { GamePlayerSideBaseDto };