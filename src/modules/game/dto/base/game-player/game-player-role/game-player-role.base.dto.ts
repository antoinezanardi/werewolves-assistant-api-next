import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum } from "class-validator";
import { ROLE_NAMES } from "../../../../../role/enums/role.enum";
import { playerRoleApiProperties } from "../../../../constants/player/player-role.constant";
import { playerApiProperties } from "../../../../constants/player/player.constant";

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