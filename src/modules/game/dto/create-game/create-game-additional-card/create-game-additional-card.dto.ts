import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum } from "class-validator";

import { GameAdditionalCardRecipientRoleName } from "@/modules/game/types/game-additional-card.types";
import { GAME_ADDITIONAL_CARDS_RECIPIENTS } from "@/modules/game/constants/game-additional-card/game-additional-card.constant";
import { GAME_ADDITIONAL_CARDS_API_PROPERTIES } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema.constant";
import { RoleNames } from "@/modules/role/enums/role.enum";

class CreateGameAdditionalCardDto {
  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.roleName as ApiPropertyOptions)
  @IsEnum(RoleNames)
  @Expose()
  public roleName: RoleNames;

  @ApiProperty(GAME_ADDITIONAL_CARDS_API_PROPERTIES.recipient as ApiPropertyOptions)
  @IsEnum(GAME_ADDITIONAL_CARDS_RECIPIENTS)
  @Expose()
  public recipient: GameAdditionalCardRecipientRoleName;
}

export { CreateGameAdditionalCardDto };