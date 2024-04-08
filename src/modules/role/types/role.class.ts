import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, Min } from "class-validator";

import { GAME_ADDITIONAL_CARDS_RECIPIENTS } from "@/modules/game/constants/game-additional-card/game-additional-card.constants";
import { GameAdditionalCardRecipientRoleName } from "@/modules/game/types/game-additional-card/game-additional-card.types";
import { ROLE_NAMES } from "@/modules/role/constants/role.constants";
import { RoleOrigins, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";
import { RoleName } from "@/modules/role/types/role.types";

class Role {
  @ApiProperty({
    description: "Role's name",
    enum: ROLE_NAMES,
  })
  @IsEnum(ROLE_NAMES)
  @Expose()
  public name: RoleName;

  @ApiProperty({
    description: "Role's side",
    enum: RoleSides,
  })
  @IsEnum(RoleSides)
  @Expose()
  public side: RoleSides;

  @ApiProperty({
    description: "Role's type",
    enum: RoleTypes,
  })
  @IsEnum(RoleTypes)
  @Expose()
  public type: RoleTypes;

  @ApiProperty({
    description: "Role's origin",
    enum: RoleOrigins,
  })
  @IsEnum(RoleOrigins)
  @Expose()
  public origin: RoleOrigins;

  @ApiProperty({
    description: "If set, this role can be used as an additional card for the recipients set. Otherwise, it can't be used as an additional card by anyone",
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(GAME_ADDITIONAL_CARDS_RECIPIENTS, { each: true })
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