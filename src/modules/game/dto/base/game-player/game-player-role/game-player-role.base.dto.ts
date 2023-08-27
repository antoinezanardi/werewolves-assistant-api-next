import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum } from "class-validator";

import { playerRoleApiProperties } from "@/modules/game/constants/player/player-role.constant";
import { playerApiProperties } from "@/modules/game/constants/player/player.constant";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

class GamePlayerRoleBaseDto {
  @ApiProperty(playerApiProperties.role)
  @IsEnum(ROLE_NAMES)
  public name: ROLE_NAMES;

  @ApiProperty(playerRoleApiProperties.original)
  @IsEnum(ROLE_NAMES)
  public original: ROLE_NAMES;

  @ApiProperty(playerRoleApiProperties.current)
  @IsEnum(ROLE_NAMES)
  public current: ROLE_NAMES;

  @ApiProperty(playerRoleApiProperties.isRevealed)
  @IsBoolean()
  public isRevealed: boolean;
}

export { GamePlayerRoleBaseDto };