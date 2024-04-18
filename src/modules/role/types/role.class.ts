import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsArray, IsIn, IsInt, IsOptional, Min } from "class-validator";

import { GAME_ADDITIONAL_CARDS_RECIPIENTS } from "@/modules/game/constants/game-additional-card/game-additional-card.constants";
import { GameAdditionalCardRecipientRoleName } from "@/modules/game/types/game-additional-card/game-additional-card.types";
import { ROLE_NAMES, ROLE_ORIGINS, ROLE_SIDES, ROLE_TYPES } from "@/modules/role/constants/role.constants";
import { RoleName, RoleOrigin, RoleSide, RoleType } from "@/modules/role/types/role.types";

class Role {
  @ApiProperty({
    description: "Role's name",
    enum: ROLE_NAMES,
  })
  @IsIn(ROLE_NAMES)
  @Expose()
  public name: RoleName;

  @ApiProperty({
    description: "Role's side",
    enum: ROLE_SIDES,
  })
  @IsIn(ROLE_SIDES)
  @Expose()
  public side: RoleSide;

  @ApiProperty({
    description: "Role's type",
    enum: ROLE_TYPES,
  })
  @IsIn(ROLE_TYPES)
  @Expose()
  public type: RoleType;

  @ApiProperty({
    description: "Role's origin",
    enum: ROLE_ORIGINS,
  })
  @IsIn(ROLE_ORIGINS)
  @Expose()
  public origin: RoleOrigin;

  @ApiProperty({
    description: "If set, this role can be used as an additional card for the recipients set. Otherwise, it can't be used as an additional card by anyone",
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsIn(GAME_ADDITIONAL_CARDS_RECIPIENTS, { each: true })
  @Expose()
  public additionalCardsEligibleRecipients?: GameAdditionalCardRecipientRoleName[];

  @ApiProperty({ description: "If the role is chosen by at least one player, then `minInGame` players must choose it to start the game" })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  public minInGame?: number;

  @ApiProperty({ description: "Maximum possible of this role in a game" })
  @IsInt()
  @Min(1)
  @Expose()
  public maxInGame: number;

  @ApiProperty({ description: "It is recommended to have at least `recommendedMinPlayers` players in game for choosing this role" })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Expose()
  public recommendedMinPlayers?: number;
}

export { Role };