import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { playerSideApiProperties } from "@/modules/game/constants/player/player-side.constant";
import { ROLE_SIDES } from "@/modules/role/enums/role.enum";

class GamePlayerSideBaseDto {
  @ApiProperty(playerSideApiProperties.original)
  @IsEnum(ROLE_SIDES)
  public original: ROLE_SIDES;

  @ApiProperty(playerSideApiProperties.current)
  @IsEnum(ROLE_SIDES)
  public current: ROLE_SIDES;
}

export { GamePlayerSideBaseDto };