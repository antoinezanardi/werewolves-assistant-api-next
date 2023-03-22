import { ApiHideProperty, PickType } from "@nestjs/swagger";
import { Allow } from "class-validator";
import { ROLE_NAMES } from "../../../../../role/enums/role.enum";
import { GamePlayerRoleBaseDto } from "../../../base/game-player/game-player-role/game-player-role.base.dto";

class CreateGamePlayerRoleDto extends PickType(GamePlayerRoleBaseDto, ["name"] as const) {
  @ApiHideProperty()
  @Allow()
  public original?: ROLE_NAMES;

  @ApiHideProperty()
  @Allow()
  public current?: ROLE_NAMES;

  @ApiHideProperty()
  @Allow()
  public isRevealed?: boolean;
}

export { CreateGamePlayerRoleDto };