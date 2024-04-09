import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

import { PLAYER_SIDE_API_PROPERTIES } from "@/modules/game/schemas/player/player-side/player-side.schema.constants";
import { ROLE_SIDES } from "@/modules/role/constants/role.constants";
import { RoleSide } from "@/modules/role/types/role.types";

class GamePlayerSideBaseDto {
  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.original as ApiPropertyOptions)
  @IsIn(ROLE_SIDES)
  public original: RoleSide;

  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.current as ApiPropertyOptions)
  @IsIn(ROLE_SIDES)
  public current: RoleSide;
}

export { GamePlayerSideBaseDto };