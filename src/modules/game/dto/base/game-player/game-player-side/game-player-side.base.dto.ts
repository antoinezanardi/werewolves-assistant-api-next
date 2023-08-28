import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { PLAYER_SIDE_API_PROPERTIES } from "@/modules/game/constants/player/player-side.constant";
import { RoleSides } from "@/modules/role/enums/role.enum";

class GamePlayerSideBaseDto {
  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.original)
  @IsEnum(RoleSides)
  public original: RoleSides;

  @ApiProperty(PLAYER_SIDE_API_PROPERTIES.current)
  @IsEnum(RoleSides)
  public current: RoleSides;
}

export { GamePlayerSideBaseDto };