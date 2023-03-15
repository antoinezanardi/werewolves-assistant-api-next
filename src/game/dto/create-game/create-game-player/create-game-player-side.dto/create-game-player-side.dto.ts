import { ApiHideProperty } from "@nestjs/swagger";
import { Allow } from "class-validator";
import { ROLE_SIDES } from "../../../../../role/enums/role.enum";

class CreateGamePlayerSideDto {
  @ApiHideProperty()
  @Allow()
  public original?: ROLE_SIDES;

  @ApiHideProperty()
  @Allow()
  public current?: ROLE_SIDES;
}

export { CreateGamePlayerSideDto };