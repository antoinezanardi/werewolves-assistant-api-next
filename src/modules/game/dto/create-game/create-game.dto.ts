import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMaxSize, Equals, IsArray, IsOptional, ValidateNested } from "class-validator";

import { CompositionGroupsSize } from "@/modules/game/dto/base/decorators/composition/composition-groups-size.decorator";
import { AdditionalCardsForActorRoles } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-actor-roles.decorator";
import { AdditionalCardsForActorSize } from "@/modules/game/dto/base/decorators/additional-cards/additional-cards-for-actor-size.decorator";
import { CompositionHasTwoGroupsWithPrejudicedManipulator } from "@/modules/game/dto/base/decorators/composition/composition-has-two-groups-with-prejudiced-manipulator.decorator";
import { CompositionGroupsPresence } from "@/modules/game/dto/base/decorators/composition/composition-groups-presence.decorator";
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
import { GamePhases } from "@/modules/game/enums/game.enum";
import { GamePlay } from "@/modules/game/schemas/game-play/game-play.schema";
import { GAME_API_PROPERTIES, GAME_FIELDS_SPECS } from "@/modules/game/schemas/game.schema.constants";

class CreateGameDto {
  @ApiHideProperty()
  @IsOptional()
  @Equals(GAME_FIELDS_SPECS.turn.default)
  public turn: number = GAME_FIELDS_SPECS.turn.default;

  @ApiHideProperty()
  @IsOptional()
  @Equals(GAME_FIELDS_SPECS.phase.default)
  public phase: GamePhases = GAME_FIELDS_SPECS.phase.default;

  @ApiProperty(GAME_API_PROPERTIES.players as ApiPropertyOptions)
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
  @CompositionGroupsPresence()
  @CompositionGroupsSize()
  @CompositionHasTwoGroupsWithPrejudicedManipulator()
  public players: CreateGamePlayerDto[];

  @ApiHideProperty()
  @IsOptional()
  public currentPlay: GamePlay;

  @ApiHideProperty()
  @IsOptional()
  @ArrayMaxSize(0)
  public upcomingPlays: GamePlay[] = [];

  @ApiProperty({
    ...GAME_API_PROPERTIES.additionalCards,
    required: false,
  } as ApiPropertyOptions)
  @Type(() => CreateGameAdditionalCardDto)
  @ValidateNested({ each: true })
  @AdditionalCardsPresence()
  @AdditionalCardsRolesMaxInGame()
  @AdditionalCardsForThiefSize()
  @AdditionalCardsForThiefRoles()
  @AdditionalCardsForActorSize()
  @AdditionalCardsForActorRoles()
  public additionalCards?: CreateGameAdditionalCardDto[];

  @ApiProperty({
    ...GAME_API_PROPERTIES.options,
    required: false,
  } as ApiPropertyOptions)
  @Type(() => CreateGameOptionsDto)
  @ValidateNested()
  public options: CreateGameOptionsDto = new CreateGameOptionsDto();
}

export { CreateGameDto };