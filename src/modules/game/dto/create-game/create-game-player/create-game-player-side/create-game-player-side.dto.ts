import { ApiHideProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Allow } from "class-validator";

import { ROLE_SIDES } from "@/modules/role/enums/role.enum";

class CreateGamePlayerSideDto {
  @ApiHideProperty()
  @Allow()
  @Expose()
  public original?: ROLE_SIDES;

  @ApiHideProperty()
  @Allow()
  @Expose()
  public current?: ROLE_SIDES;
}

export { CreateGamePlayerSideDto };