import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { ROLE_SIDES } from "../../../../../role/enums/role.enum";
import { playerSideApiProperties } from "../../../../constants/player/player-side.constant";

class GamePlayerSideBaseDto {
  @ApiProperty(playerSideApiProperties.original)
  @IsEnum(ROLE_SIDES)
  public original: ROLE_SIDES;

  @ApiProperty(playerSideApiProperties.current)
  @IsEnum(ROLE_SIDES)
  public current: ROLE_SIDES;
}

export { GamePlayerSideBaseDto };