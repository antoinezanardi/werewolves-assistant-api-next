import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMaxSize, Equals, IsArray, IsOptional, ValidateNested } from "class-validator";

import { AdditionalCardsForThiefRoles } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-thief-roles.decorator";
import { AdditionalCardsForThiefSize } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-thief-size.decorator";
import { AdditionalCardsPresence } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-presence.decorator";
import { AdditionalCardsRolesMaxInGame } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-roles-max-in-game.decorator";
import { CompositionBounds } from "@/modules/game/dto/base/decorators/composition/composition-bounds.decorator";
import { CompositionHasVillager } from "@/modules/game/dto/base/decorators/composition/composition-has-villager.decorator";
import { CompositionHasWerewolf } from "@/modules/game/dto/base/decorators/composition/composition-has-werewolf.decorator";
import { CompositionPositionsConsistency } from "@/modules/game/dto/base/decorators/composition/composition-positions-consistency.decorator";
import { CompositionRolesMaxInGame } from "@/modules/game/dto/base/decorators/composition/composition-roles-max-in-game.decorator";
import { CompositionRolesMinInGame } from "@/modules/game/dto/base/decorators/composition/composition-roles-min-in-game.decorator";
import { CompositionUniqueNames } from "@/modules/game/dto/base/decorators/composition/composition-unique-names.decorator";
import { gamePlayersPositionTransformer } from "@/modules/game/dto/base/transformers/game-players-position.transformer";
import { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";
import { CreateGameOptionsDto } from "@/modules/game/dto/create-game/create-game-options/create-game-options.dto";
import { CreateGamePlayerDto } from "@/modules/game/dto/create-game/create-game-player/create-game-player.dto";
import { GAME_PHASES } from "@/modules/game/enums/game.enum";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { gameApiProperties, gameFieldsSpecs } from "@/modules/game/schemas/game.schema.constant";

class CreateGameDto {
  @ApiHideProperty()
  @IsOptional()
  @Equals(gameFieldsSpecs.turn.default)
  public turn: number = gameFieldsSpecs.turn.default;

  @ApiHideProperty()
  @IsOptional()
  @Equals(gameFieldsSpecs.phase.default)
  public phase: GAME_PHASES = gameFieldsSpecs.phase.default;

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

  @ApiHideProperty()
  @IsOptional()
  @ArrayMaxSize(0)
  public currentPlay: GamePlay;

  @ApiHideProperty()
  @IsOptional()
  @ArrayMaxSize(0)
  public upcomingPlays: GamePlay[] = [];

  @ApiProperty({
    ...gameApiProperties.additionalCards,
    required: false,
  })
  @Type(() => CreateGameAdditionalCardDto)
  @ValidateNested({ each: true })
  @AdditionalCardsPresence()
  @AdditionalCardsRolesMaxInGame()
  @AdditionalCardsForThiefSize()
  @AdditionalCardsForThiefRoles()
  public additionalCards?: CreateGameAdditionalCardDto[];

  @ApiProperty({
    ...gameApiProperties.options,
    required: false,
  })
  @Type(() => CreateGameOptionsDto)
  @ValidateNested()
  public options: CreateGameOptionsDto = new CreateGameOptionsDto();
}

export { CreateGameDto };