import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { gameApiProperties } from "../../constants/game.constant";
import { CompositionBounds } from "../base/decorators/composition-bounds.decorator";
import { CompositionHasVillager } from "../base/decorators/composition-has-villager.decorator";
import { CompositionHasWerewolf } from "../base/decorators/composition-has-werewolf.decorator";
import { CompositionPositionsConsistency } from "../base/decorators/composition-positions-consistency.decorator";
import { CompositionRolesMaxInGame } from "../base/decorators/composition-roles-max-in-game.decorator";
import { CompositionRolesMinInGame } from "../base/decorators/composition-roles-min-in-game.decorator";
import { CompositionUniqueNames } from "../base/decorators/composition-unique-names.decorator";
import { gamePlayersPositionTransformer } from "../base/transformers/game-players-position.transformer";
import { CreateGameOptionsDto } from "./create-game-options/create-game-options.dto";
import { CreateGamePlayerDto } from "./create-game-player/create-game-player.dto";

class CreateGameDto {
  @ApiProperty(gameApiProperties.players)
  @Transform(gamePlayersPositionTransformer)
  @Type(() => CreateGamePlayerDto)
  @ValidateNested({ each: true })
  @IsArray()
  @CompositionUniqueNames()
  @CompositionBounds()
  @CompositionRolesMinInGame()
  @CompositionRolesMaxInGame()
  @CompositionHasVillager()
  @CompositionHasWerewolf()
  @CompositionPositionsConsistency()
  public players: CreateGamePlayerDto[];

  @ApiProperty({
    ...gameApiProperties.options,
    required: false,
  })
  @Type(() => CreateGameOptionsDto)
  @ValidateNested()
  public options: CreateGameOptionsDto = new CreateGameOptionsDto();
}

export { CreateGameDto };