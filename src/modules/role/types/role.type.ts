import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";

import { RoleNames, RoleOrigins, RoleSides, RoleTypes } from "@/modules/role/enums/role.enum";

class Role {
  @ApiProperty({ description: "Role's name" })
  @IsEnum(RoleNames)
  @Expose()
  public name: RoleNames;

  @ApiProperty({ description: "Role's side" })
  @IsEnum(RoleSides)
  @Expose()
  public side: RoleSides;

  @ApiProperty({ description: "Role's type" })
  @IsEnum(RoleTypes)
  @Expose()
  public type: RoleTypes;

  @ApiProperty({ description: "Role's origin" })
  @IsEnum(RoleOrigins)
  @Expose()
  public origin: RoleOrigins;

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