import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_API_PROPERTIES, GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_SPECS_FIELDS } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction-boundaries/game-play-source-interaction-boundaries.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlaySourceInteractionBoundaries {
  @ApiProperty(GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_API_PROPERTIES.min as ApiPropertyOptions)
  @Prop(GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_SPECS_FIELDS.min)
  @Expose()
  public min: number;

  @ApiProperty(GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_API_PROPERTIES.max as ApiPropertyOptions)
  @Prop(GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_SPECS_FIELDS.max)
  @Expose()
  public max: number;
}

const GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_SCHEMA = SchemaFactory.createForClass(GamePlaySourceInteractionBoundaries);

export {
  GamePlaySourceInteractionBoundaries,
  GAME_PLAY_SOURCE_INTERACTION_BOUNDARIES_SCHEMA,
};