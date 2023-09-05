import { ApiHideProperty, ApiProperty, IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { ValidateNested } from "class-validator";

import { PLAYER_API_PROPERTIES } from "@/modules/game/schemas/player/player.schema.constant";
import { GamePlayerBaseDto } from "@/modules/game/dto/base/game-player/game-player.base.dto";
import { playerRoleTransformer } from "@/modules/game/dto/base/game-player/transformers/player-role.transformer";
import { playerSideTransformer } from "@/modules/game/dto/base/game-player/transformers/player-side.transformer";
import { CreateGamePlayerRoleDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player-role/create-game-player-role.dto";
import { CreateGamePlayerSideDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player-side/create-game-player-side.dto";

class CreateGamePlayerDto extends IntersectionType(
  PickType(GamePlayerBaseDto, ["name"] as const),
  PickType(PartialType(GamePlayerBaseDto), ["position"] as const),
) {
  @Transform(playerRoleTransformer)
  @ApiProperty(PLAYER_API_PROPERTIES.role)
  @Type(() => CreateGamePlayerRoleDto)
  @ValidateNested()
  @Expose()
  public role: CreateGamePlayerRoleDto;

  @ApiHideProperty()
  @Type(() => CreateGamePlayerSideDto)
  @ValidateNested()
  @Transform(playerSideTransformer)
  @Expose()
  public side: CreateGamePlayerSideDto = {};

  @ApiProperty({ description: "Player's unique position among all players. Maximum is `players.length - 1`. Either all players position must be set or none of them. In that last case, it will be generated automatically" })
  @Expose()
  public position?: number;
}

export { CreateGamePlayerDto };