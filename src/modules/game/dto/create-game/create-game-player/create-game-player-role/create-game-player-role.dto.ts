import { ApiHideProperty, PickType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Allow } from "class-validator";
import { ROLE_NAMES } from "../../../../../role/enums/role.enum";
import { GamePlayerRoleBaseDto } from "../../../base/game-player/game-player-role/game-player-role.base.dto";

class CreateGamePlayerRoleDto extends PickType(GamePlayerRoleBaseDto, ["name"] as const) {
  @ApiHideProperty()
  @Allow()
  @Expose()
  public original?: ROLE_NAMES;

  @ApiHideProperty()
  @Allow()
  @Expose()
  public current?: ROLE_NAMES;

  @ApiHideProperty()
  @Allow()
  @Expose()
  public isRevealed?: boolean;
}

export { CreateGamePlayerRoleDto };