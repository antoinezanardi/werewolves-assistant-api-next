import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { IsInt, IsString, MaxLength, Min, MinLength, ValidateNested } from "class-validator";

import { playerApiProperties, playersFieldsSpecs } from "@/modules/game/constants/player/player.constant";
import { GamePlayerRoleBaseDto } from "@/modules/game/dto/base/game-player/game-player-role/game-player-role.base.dto";
import { GamePlayerSideBaseDto } from "@/modules/game/dto/base/game-player/game-player-side/game-player-side.base.dto";
import { playerRoleTransformer } from "@/modules/game/dto/base/game-player/transformers/player-role.transformer";
import { playerSideTransformer } from "@/modules/game/dto/base/game-player/transformers/player-side.transformer";

class GamePlayerBaseDto {
  @ApiProperty(playerApiProperties.name)
  @IsString()
  @MinLength(playersFieldsSpecs.name.minLength)
  @MaxLength(playersFieldsSpecs.name.maxLength)
  @Expose()
  public name: string;

  @ApiProperty(playerApiProperties.role)
  @Transform(playerRoleTransformer)
  @Type(() => GamePlayerRoleBaseDto)
  @ValidateNested()
  @Expose()
  public role: GamePlayerRoleBaseDto;

  @ApiProperty(playerApiProperties.role)
  @Transform(playerSideTransformer)
  @Type(() => GamePlayerRoleBaseDto)
  @ValidateNested()
  @Expose()
  public side: GamePlayerSideBaseDto;

  @ApiProperty(playerApiProperties.position)
  @IsInt()
  @Min(playersFieldsSpecs.position.minimum)
  @Expose()
  public position: number;
}

export { GamePlayerBaseDto };