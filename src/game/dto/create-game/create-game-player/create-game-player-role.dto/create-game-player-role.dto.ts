import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Allow, IsEnum } from "class-validator";
import { ROLE_NAMES } from "../../../../../role/enums/role.enum";
import { playerApiProperties } from "../../../../schemas/player/constants/player.constant";

class CreateGamePlayerRoleDto {
  @ApiProperty(playerApiProperties.role)
  @IsEnum(ROLE_NAMES)
  public name: ROLE_NAMES;

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