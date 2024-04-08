import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsIn } from "class-validator";

import { PLAYER_ROLE_API_PROPERTIES } from "@/modules/game/schemas/player/player-role/player-role.schema.constants";
import { PLAYER_API_PROPERTIES } from "@/modules/game/schemas/player/player.schema.constants";
import { ROLE_NAMES } from "@/modules/role/constants/role.constants";
import { RoleName } from "@/modules/role/types/role.types";

class GamePlayerRoleBaseDto {
  @ApiProperty(PLAYER_API_PROPERTIES.role as ApiPropertyOptions)
  @IsIn(ROLE_NAMES)
  public name: RoleName;

  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.original as ApiPropertyOptions)
  @IsIn(ROLE_NAMES)
  public original: RoleName;

  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.current as ApiPropertyOptions)
  @IsIn(ROLE_NAMES)
  public current: RoleName;

  @ApiProperty(PLAYER_ROLE_API_PROPERTIES.isRevealed as ApiPropertyOptions)
  @IsBoolean()
  public isRevealed: boolean;
}

export { GamePlayerRoleBaseDto };