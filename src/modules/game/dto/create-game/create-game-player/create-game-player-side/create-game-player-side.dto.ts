import { ApiHideProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Allow } from "class-validator";

import { RoleSides } from "@/modules/role/enums/role.enum";

class CreateGamePlayerSideDto {
  @ApiHideProperty()
  @Allow()
  @Expose()
  public original?: RoleSides;

  @ApiHideProperty()
  @Allow()
  @Expose()
  public current?: RoleSides;
}

export { CreateGamePlayerSideDto };