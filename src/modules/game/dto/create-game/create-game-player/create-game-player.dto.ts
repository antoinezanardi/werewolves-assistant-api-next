import { ApiHideProperty, ApiProperty, IntersectionType, PartialType, PickType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { playerApiProperties } from "../../../constants/player/player.constant";
import { GamePlayerBaseDto } from "../../base/game-player/game-player.base.dto";
import { playerRoleTransformer } from "../../base/game-player/transformers/player-role.transformer";
import { playerSideTransformer } from "../../base/game-player/transformers/player-side.transformer";
import { CreateGamePlayerRoleDto } from "./create-game-player-role.dto/create-game-player-role.dto";
import { CreateGamePlayerSideDto } from "./create-game-player-side.dto/create-game-player-side.dto";

class CreateGamePlayerDto extends IntersectionType(
  PickType(GamePlayerBaseDto, ["name"] as const),
  PickType(PartialType(GamePlayerBaseDto), ["position"] as const),
) {
  @Transform(playerRoleTransformer)
  @ApiProperty(playerApiProperties.role)
  @Type(() => CreateGamePlayerRoleDto)
  @ValidateNested()
  public role: CreateGamePlayerRoleDto;

  @ApiHideProperty()
  @Type(() => CreateGamePlayerSideDto)
  @ValidateNested()
  @Transform(playerSideTransformer)
  public side: CreateGamePlayerSideDto;

  @ApiProperty({ description: "Player's unique position among all players. Maximum is `players.length - 1`. Either all players position must be set or none of them. In that last case, it will be generated automatically" })
  public position?: number;
}

export { CreateGamePlayerDto };