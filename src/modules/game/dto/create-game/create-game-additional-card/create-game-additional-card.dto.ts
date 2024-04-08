import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum } from "class-validator";

import { RoleName } from "@/modules/role/types/role.types";
import { ROLE_NAMES } from "@/modules/role/constants/role.constants";
import { GameAdditionalCardRecipientRoleName } from "@/modules/game/types/game-additional-card/game-additional-card.types";
import { GAME_ADDITIONAL_CARDS_RECIPIENTS } from "@/modules/game/constants/game-additional-card/game-additional-card.constants";
import { GAME_ADDITIONAL_CARDS_API_PROPERTIES } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema.constants";

class CreateGameAdditionalCardDto {
  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.roleName as ApiPropertyOptions)
  @IsEnum(ROLE_NAMES)
  @Expose()
  public roleName: RoleName;

  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.recipient as ApiPropertyOptions)
  @IsEnum(GAME_ADDITIONAL_CARDS_RECIPIENTS)
  @Expose()
  public recipient: GameAdditionalCardRecipientRoleName;
}

export { CreateGameAdditionalCardDto };