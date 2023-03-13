import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, MaxLength, Min, MinLength } from "class-validator";
import { ROLE_NAMES } from "../../../../role/enums/role.enum";
import { playerApiProperties, playersFieldsSpecs } from "../../../schemas/player/constants/player.constant";

class CreateGamePlayerDto {
  @ApiProperty(playerApiProperties.name)
  @MinLength(playersFieldsSpecs.name.minLength)
  @MaxLength(playersFieldsSpecs.name.maxLength)
  public name: string;

  @ApiProperty(playerApiProperties.role)
  public role: ROLE_NAMES;

  @ApiProperty({
    ...playerApiProperties.position,
    description: "Player's unique position among all players. Maximum is `players.length - 1`. Either all players position must be set or none of them. In that last case, it will be generated automatically",
  })
  @IsOptional()
  @Min(playersFieldsSpecs.position.minimum)
  public position?: number;
}

export { CreateGamePlayerDto };