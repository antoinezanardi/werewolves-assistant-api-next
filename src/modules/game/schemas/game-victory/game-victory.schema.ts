import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { gameVictoryApiProperties } from "../../constants/game-victory/game-victory.constant";
import { GAME_VICTORY_TYPES } from "../../enums/game-victory.enum";
import { PlayerSchema, Player } from "../player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameVictory {
  @ApiProperty(gameVictoryApiProperties.type)
  @Prop({ required: true, enum: gameVictoryApiProperties.type.enum })
  @Expose()
  public type: GAME_VICTORY_TYPES;

  @ApiProperty(gameVictoryApiProperties.winners)
  @Prop({ type: [PlayerSchema], default: undefined })
  @Type(() => Player)
  @Expose()
  public winners?: Player[];
}

const GameVictorySchema = SchemaFactory.createForClass(GameVictory);

export { GameVictory, GameVictorySchema };