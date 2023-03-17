import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsOptional, MaxLength, Min, MinLength, ValidateNested } from "class-validator";
import { playerApiProperties, playersFieldsSpecs } from "../../../schemas/player/constants/player.constant";
import { CreateGamePlayerRoleDto } from "./create-game-player-role.dto/create-game-player-role.dto";
import { CreateGamePlayerSideDto } from "./create-game-player-side.dto/create-game-player-side.dto";
import { playerRoleTransformer } from "./transformers/player-role.transformer";
import { playerSideTransformer } from "./transformers/player-side.transformer";

class CreateGamePlayerDto {
  @ApiProperty(playerApiProperties.name)
  @MinLength(playersFieldsSpecs.name.minLength)
  @MaxLength(playersFieldsSpecs.name.maxLength)
  public name: string;

  @ApiProperty(playerApiProperties.role)
  @Type(() => CreateGamePlayerRoleDto)
  @ValidateNested()
  @Transform(playerRoleTransformer)
  public role: CreateGamePlayerRoleDto;

  @ApiHideProperty()
  @Type(() => CreateGamePlayerSideDto)
  @ValidateNested()
  @Transform(playerSideTransformer)
  public side: CreateGamePlayerSideDto;

  @ApiProperty({
    ...playerApiProperties.position,
    description: "Player's unique position among all players. Maximum is `players.length - 1`. Either all players position must be set or none of them. In that last case, it will be generated automatically",
  })
  @IsOptional()
  @Min(playersFieldsSpecs.position.minimum)
  public position?: number;
}

export { CreateGamePlayerDto };