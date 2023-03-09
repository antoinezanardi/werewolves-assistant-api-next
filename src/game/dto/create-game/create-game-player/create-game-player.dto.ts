import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, MaxLength, Min, MinLength } from "class-validator";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";

class CreateGamePlayerDto {
  @ApiProperty({
    description: "Player's name. Must be unique in the array and between 1 and 30 characters long",
    example: "Antoine",
  })
  @MinLength(1)
  @MaxLength(30)
  public name: string;

  @ApiProperty({ description: "Player's role" })
  public role: ROLE_NAMES;

  @ApiProperty({ description: "Player's unique position among all players. Maximum is `players.length - 1`. Either all players position must be set or none of them. In that last case, it will be generated automatically." })
  @IsOptional()
  @Min(0)
  public position?: number;
}

export { CreateGamePlayerDto };