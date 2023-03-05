import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { ROLE_NAMES, ROLE_SIDES, ROLE_TYPES } from "./role.enum";

class Role {
  @IsEnum(ROLE_NAMES)
  public name: ROLE_NAMES;

  @IsEnum(ROLE_SIDES)
  public side: ROLE_SIDES;

  @IsEnum(ROLE_TYPES)
  public type: ROLE_TYPES;

  @IsOptional()
  @IsInt()
  @Min(1)
  public minInGame?: number;

  @IsInt()
  @Min(1)
  public maxInGame: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  public recommendedMinPlayers?: number;
}

export { Role };