import { ApiHideProperty, PickType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Allow } from "class-validator";

import { GamePlayerRoleBaseDto } from "@/modules/game/dto/base/game-player/game-player-role/game-player-role.base.dto";
import { RoleNames } from "@/modules/role/enums/role.enum";

class CreateGamePlayerRoleDto extends PickType(GamePlayerRoleBaseDto, ["name"] as const) {
  @ApiHideProperty()
  @Allow()
  @Expose()
  public original?: RoleNames;

  @ApiHideProperty()
  @Allow()
  @Expose()
  public current?: RoleNames;

  @ApiHideProperty()
  @Allow()
  @Expose()
  public isRevealed?: boolean;
}

export { CreateGamePlayerRoleDto };