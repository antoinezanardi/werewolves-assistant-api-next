import { ApiHideProperty, PickType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Allow } from "class-validator";

import { RoleName } from "@/modules/role/types/role.types";
import { GamePlayerRoleBaseDto } from "@/modules/game/dto/base/game-player/game-player-role/game-player-role.base.dto";

class CreateGamePlayerRoleDto extends PickType(GamePlayerRoleBaseDto, ["name"] as const) {
  @ApiHideProperty()
  @Allow()
  @Expose()
  public original?: RoleName;

  @ApiHideProperty()
  @Allow()
  @Expose()
  public current?: RoleName;

  @ApiHideProperty()
  @Allow()
  @Expose()
  public isRevealed?: boolean;
}

export { CreateGamePlayerRoleDto };