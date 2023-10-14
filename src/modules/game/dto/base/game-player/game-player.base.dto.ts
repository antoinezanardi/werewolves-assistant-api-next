import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { IsInt, IsString, MaxLength, Min, MinLength, ValidateNested } from "class-validator";

import { PLAYER_API_PROPERTIES, PLAYER_FIELDS_SPECS } from "@/modules/game/schemas/player/player.schema.constant";
import { GamePlayerRoleBaseDto } from "@/modules/game/dto/base/game-player/game-player-role/game-player-role.base.dto";
import { GamePlayerSideBaseDto } from "@/modules/game/dto/base/game-player/game-player-side/game-player-side.base.dto";
import { playerRoleTransformer } from "@/modules/game/dto/base/game-player/transformers/player-role.transformer";
import { playerSideTransformer } from "@/modules/game/dto/base/game-player/transformers/player-side.transformer";

class GamePlayerBaseDto {
  @ApiProperty(PLAYER_API_PROPERTIES.name as ApiPropertyOptions)
  @IsString()
  @MinLength(PLAYER_FIELDS_SPECS.name.minLength)
  @MaxLength(PLAYER_FIELDS_SPECS.name.maxLength)
  @Expose()
  public name: string;

  @ApiProperty(PLAYER_API_PROPERTIES.role as ApiPropertyOptions)
  @Transform(playerRoleTransformer)
  @Type(() => GamePlayerRoleBaseDto)
  @ValidateNested()
  @Expose()
  public role: GamePlayerRoleBaseDto;

  @ApiProperty(PLAYER_API_PROPERTIES.role as ApiPropertyOptions)
  @Transform(playerSideTransformer)
  @Type(() => GamePlayerRoleBaseDto)
  @ValidateNested()
  @Expose()
  public side: GamePlayerSideBaseDto;

  @ApiProperty(PLAYER_API_PROPERTIES.position as ApiPropertyOptions)
  @IsInt()
  @Min(PLAYER_FIELDS_SPECS.position.min)
  @Expose()
  public position: number;
}

export { GamePlayerBaseDto };