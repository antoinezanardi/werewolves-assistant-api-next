import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { ROLE_NAMES, ROLE_SIDES, ROLE_TYPES } from "../enums/role.enum";

class Role {
  @ApiProperty({ description: "Role's name" })
  @IsEnum(ROLE_NAMES)
  public name: ROLE_NAMES;

  @ApiProperty({ description: "Role's side" })
  @IsEnum(ROLE_SIDES)
  public side: ROLE_SIDES;

  @ApiProperty({ description: "Role's type" })
  @IsEnum(ROLE_TYPES)
  public type: ROLE_TYPES;

  @ApiProperty({ description: "If the role is chosen by at least one player, then `minInGame` players must choose it to start the game" })
  @IsOptional()
  @IsInt()
  @Min(1)
  public minInGame?: number;

  @ApiProperty({ description: "Maximum possible of this role in a game" })
  @IsInt()
  @Min(1)
  public maxInGame: number;

  @ApiProperty({ description: "It is recommended to have at least `recommendedMinPlayers` players in game for choosing this role" })
  @IsOptional()
  @IsInt()
  @Min(1)
  public recommendedMinPlayers?: number;
}

export { Role };