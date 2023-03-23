import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsInt, IsString, MaxLength, Min, MinLength, ValidateNested } from "class-validator";
import { playerApiProperties, playersFieldsSpecs } from "../../../schemas/player/constants/player.constant";
import { GamePlayerRoleBaseDto } from "./game-player-role/game-player-role.base.dto";
import { GamePlayerSideBaseDto } from "./game-player-side/game-player-side.base.dto";
import { playerRoleTransformer } from "./transformers/player-role.transformer";
import { playerSideTransformer } from "./transformers/player-side.transformer";

class GamePlayerBaseDto {
  @ApiProperty(playerApiProperties.name)
  @IsString()
  @MinLength(playersFieldsSpecs.name.minLength)
  @MaxLength(playersFieldsSpecs.name.maxLength)
  public name: string;

  @ApiProperty(playerApiProperties.role)
  @Transform(playerRoleTransformer)
  @Type(() => GamePlayerRoleBaseDto)
  @ValidateNested()
  public role: GamePlayerRoleBaseDto;

  @ApiProperty(playerApiProperties.role)
  @Transform(playerSideTransformer)
  @Type(() => GamePlayerRoleBaseDto)
  @ValidateNested()
  public side: GamePlayerSideBaseDto;

  @ApiProperty(playerApiProperties.position)
  @IsInt()
  @Min(playersFieldsSpecs.position.minimum)
  public position: number;
}

export { GamePlayerBaseDto };