import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GamePlaySourceInteractionBoundaries } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction-boundaries/game-play-source-interaction-boundaries.schema";
import { GameSource } from "@/modules/game/types/game.types";
import { GAME_PLAY_SOURCE_INTERACTION_API_PROPERTIES, GAME_PLAY_SOURCE_INTERACTION_FIELDS_SPECS } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema.constants";
import { PlayerInteractionTypes } from "@/modules/game/enums/player.enum";
import { Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlaySourceInteraction {
  @ApiProperty(GAME_PLAY_SOURCE_INTERACTION_API_PROPERTIES.source as ApiPropertyOptions)
  @Prop(GAME_PLAY_SOURCE_INTERACTION_FIELDS_SPECS.source)
  @Expose()
  public source: GameSource;

  @ApiProperty(GAME_PLAY_SOURCE_INTERACTION_API_PROPERTIES.type as ApiPropertyOptions)
  @Prop(GAME_PLAY_SOURCE_INTERACTION_FIELDS_SPECS.type)
  @Expose()
  public type: PlayerInteractionTypes;

  @ApiProperty(GAME_PLAY_SOURCE_INTERACTION_API_PROPERTIES.eligibleTargets as ApiPropertyOptions)
  @Prop(GAME_PLAY_SOURCE_INTERACTION_FIELDS_SPECS.eligibleTargets)
  @Type(() => Player)
  @Expose()
  public eligibleTargets: Player[];

  @ApiProperty(GAME_PLAY_SOURCE_INTERACTION_API_PROPERTIES.boundaries as ApiPropertyOptions)
  @Prop(GAME_PLAY_SOURCE_INTERACTION_FIELDS_SPECS.boundaries)
  @Type(() => GamePlaySourceInteractionBoundaries)
  @Expose()
  public boundaries: GamePlaySourceInteractionBoundaries;
}

const GAME_PLAY_SOURCE_INTERACTION_SCHEMA = SchemaFactory.createForClass(GamePlaySourceInteraction);

export {
  GamePlaySourceInteraction,
  GAME_PLAY_SOURCE_INTERACTION_SCHEMA,
};