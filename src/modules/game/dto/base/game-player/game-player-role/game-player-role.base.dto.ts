import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum } from "class-validator";

import { PLAYER_ROLE_API_PROPERTIES } from "@/modules/game/schemas/player/player-role/player-role.schema.constant";
import { PLAYER_API_PROPERTIES } from "@/modules/game/schemas/player/player.schema.constant";
import { RoleNames } from "@/modules/role/enums/role.enum";

class GamePlayerRoleBaseDto {
  @ApiProperty(PLAYER_API_PROPERTIES.role as ApiPropertyOptions)
  @IsEnum(RoleNames)
  public name: RoleNames;

  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.original as ApiPropertyOptions)
  @IsEnum(RoleNames)
  public original: RoleNames;

  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.current as ApiPropertyOptions)
  @IsEnum(RoleNames)
  public current: RoleNames;

  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.isRevealed as ApiPropertyOptions)
  @IsBoolean()
  public isRevealed: boolean;
}

export { GamePlayerRoleBaseDto };