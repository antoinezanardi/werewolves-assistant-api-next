import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsOptional, ValidateNested } from "class-validator";
import { gameApiProperties, gameFieldsSpecs } from "../../constants/game.constant";
import { CreateGameOptionsDto } from "./create-game-options/create-game-options.dto";
import { CreateGamePlayerDto } from "./create-game-player/create-game-player.dto";
import { CompositionHasVillager } from "./decorators/composition-has-villager.decorator";
import { CompositionHasWerewolf } from "./decorators/composition-has-werewolf.decorator";
import { CompositionPositionsConsistency } from "./decorators/composition-positions-consistency.decorator";
import { CompositionRolesMaxInGame } from "./decorators/composition-roles-max-in-game.decorator";
import { CompositionRolesMinInGame } from "./decorators/composition-roles-min-in-game.decorator";

class CreateGameDto {
  @ApiProperty(gameApiProperties.players)
  @IsArray()
  @ArrayMinSize(gameFieldsSpecs.players.minItems)
  @ArrayMaxSize(gameFieldsSpecs.players.maxItems)
  @ArrayUnique(({ name }: CreateGamePlayerDto) => name, { message: "players.name must be unique" })
  @Type(() => CreateGamePlayerDto)
  @ValidateNested({ each: true })
  @CompositionRolesMinInGame()
  @CompositionRolesMaxInGame()
  @CompositionHasVillager()
  @CompositionHasWerewolf()
  @CompositionPositionsConsistency()
  public players: CreateGamePlayerDto[];

  @ApiProperty(gameApiProperties.options)
  @IsOptional()
  @Type(() => CreateGameOptionsDto)
  @ValidateNested()
  public options?: CreateGameOptionsDto;
}

export { CreateGameDto };