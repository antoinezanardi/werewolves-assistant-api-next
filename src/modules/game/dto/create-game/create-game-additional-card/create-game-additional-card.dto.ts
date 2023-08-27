import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Equals, IsEnum } from "class-validator";

import { gameAdditionalCardApiProperties } from "@/modules/game/constants/game-additional-card/game-additional-card.constant";
import { ROLE_NAMES } from "@/modules/role/enums/role.enum";

class CreateGameAdditionalCardDto {
  @ApiProperty(gameAdditionalCardApiProperties.roleName)
  @IsEnum(ROLE_NAMES)
  @Expose()
  public roleName: ROLE_NAMES;

  @ApiProperty(gameAdditionalCardApiProperties.recipient)
  @Equals(ROLE_NAMES.THIEF)
  @Expose()
  public recipient: ROLE_NAMES.THIEF;
}

export { CreateGameAdditionalCardDto };