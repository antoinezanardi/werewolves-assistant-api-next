import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GamePlayAction, GamePlayCause, GamePlayOccurrence, GamePlayType } from "@/modules/game/types/game-play/game-play.types";
import { GAME_PLAY_API_PROPERTIES, GAME_PLAY_SPECS_FIELDS } from "@/modules/game/schemas/game-play/game-play.schema.constants";
import { GamePlaySource } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlay {
  @ApiProperty(GAME_PLAY_API_PROPERTIES.type as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.type)
  @Expose()
  public type: GamePlayType;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.source as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.source)
  @Type(() => GamePlaySource)
  @Expose()
  public source: GamePlaySource;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.action as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.action)
  @Expose()
  public action: GamePlayAction;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.causes as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.causes)
  @Expose()
  public causes?: GamePlayCause[];

  @ApiProperty(GAME_PLAY_API_PROPERTIES.canBeSkipped as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.canBeSkipped)
  @Expose()
  public canBeSkipped?: boolean;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.occurrence as ApiPropertyOptions)
  @Prop(GAME_PLAY_SPECS_FIELDS.occurrence)
  @Expose()
  public occurrence: GamePlayOccurrence;
}

const GAME_PLAY_SCHEMA = SchemaFactory.createForClass(GamePlay);

export {
  GamePlay,
  GAME_PLAY_SCHEMA,
};