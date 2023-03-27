import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { gamePlayApiProperties } from "../constants/game-play.constant";
import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES } from "../enums/game-play.enum";
import { GameSource } from "../types/game.type";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlay {
  @ApiProperty(gamePlayApiProperties.source)
  @Prop({ required: true })
  public source: GameSource;

  @ApiProperty(gamePlayApiProperties.action)
  @Prop({ required: true })
  public action: GAME_PLAY_ACTIONS;

  @ApiProperty(gamePlayApiProperties.cause)
  @Prop()
  public cause?: GAME_PLAY_CAUSES;
}

const GamePlaySchema = SchemaFactory.createForClass(GamePlay);

export { GamePlay, GamePlaySchema };