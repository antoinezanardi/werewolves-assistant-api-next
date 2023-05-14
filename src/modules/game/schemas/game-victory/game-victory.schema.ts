import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { gameVictoryApiProperties } from "../../constants/game-victory/game-victory.constant";
import { GAME_VICTORY_TYPES } from "../../enums/game-victory.enum";
import type { Player } from "../player/player.schema";
import { PlayerSchema } from "../player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameVictory {
  @ApiProperty(gameVictoryApiProperties.type)
  @Prop({ required: true, enum: gameVictoryApiProperties.type.enum })
  public type: GAME_VICTORY_TYPES;

  @ApiProperty(gameVictoryApiProperties.winners)
  @Prop({ type: [PlayerSchema], default: undefined })
  public winners?: Player[];
}

const GameVictorySchema = SchemaFactory.createForClass(GameVictory);

export { GameVictory, GameVictorySchema };