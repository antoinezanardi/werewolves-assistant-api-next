import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES } from "../../enums/game-play.enum";
import { GamePlaySource, GamePlaySourceSchema } from "./game-play-source/game-play-source.schema";
import { gamePlayApiProperties } from "./game-play.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlay {
  @ApiProperty(gamePlayApiProperties.source)
  @Prop({
    required: true,
    type: GamePlaySourceSchema,
  })
  @Type(() => GamePlaySource)
  @Expose()
  public source: GamePlaySource;

  @ApiProperty(gamePlayApiProperties.action)
  @Prop({ required: true })
  @Expose()
  public action: GAME_PLAY_ACTIONS;

  @ApiProperty(gamePlayApiProperties.cause)
  @Prop()
  @Expose()
  public cause?: GAME_PLAY_CAUSES;
}

const GamePlaySchema = SchemaFactory.createForClass(GamePlay);

export {
  GamePlay,
  GamePlaySchema,
};