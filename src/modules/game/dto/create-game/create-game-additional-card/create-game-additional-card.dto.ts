import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Equals, IsEnum } from "class-validator";

import { GAME_ADDITIONAL_CARDS_API_PROPERTIES } from "@/modules/game/constants/game-additional-cards/game-additional-cards.constant";
import { RoleNames } from "@/modules/role/enums/role.enum";

class CreateGameAdditionalCardDto {
  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.roleName)
  @IsEnum(RoleNames)
  @Expose()
  public roleName: RoleNames;

  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.recipient)
  @Equals(RoleNames.THIEF)
  @Expose()
  public recipient: RoleNames.THIEF;
}

export { CreateGameAdditionalCardDto };