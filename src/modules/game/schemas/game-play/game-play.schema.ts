import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import { GamePlaySource, GAME_PLAY_SOURCE_SCHEMA } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema";
import { GAME_PLAY_API_PROPERTIES } from "@/modules/game/schemas/game-play/game-play.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlay {
  @ApiProperty(GAME_PLAY_API_PROPERTIES.source)
  @Prop({
    required: true,
    type: GAME_PLAY_SOURCE_SCHEMA,
  })
  @Type(() => GamePlaySource)
  @Expose()
  public source: GamePlaySource;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.action)
  @Prop({ required: true })
  @Expose()
  public action: GamePlayActions;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.cause)
  @Prop()
  @Expose()
  public cause?: GamePlayCauses;

  @ApiProperty(GAME_PLAY_API_PROPERTIES.canBeSkipped)
  @Prop()
  @Expose()
  public canBeSkipped?: boolean;
}

const GAME_PLAY_SCHEMA = SchemaFactory.createForClass(GamePlay);

export {
  GamePlay,
  GAME_PLAY_SCHEMA,
};