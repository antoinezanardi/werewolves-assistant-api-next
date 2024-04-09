import { ApiHideProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Allow } from "class-validator";

import { RoleSide } from "@/modules/role/types/role.types";

class CreateGamePlayerSideDto {
  @ApiHideProperty()
  @Allow()
  @Expose()
  public original?: RoleSide;

  @ApiHideProperty()
  @Allow()
  @Expose()
  public current?: RoleSide;
}

export { CreateGamePlayerSideDto };