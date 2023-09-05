import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_VICTORY_API_PROPERTIES } from "@/modules/game/schemas/game-victory/game-victory.schema.constant";
import { GameVictoryTypes } from "@/modules/game/enums/game-victory.enum";
import { PLAYER_SCHEMA, Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameVictory {
  @ApiProperty(GAME_VICTORY_API_PROPERTIES.type)
  @Prop({ required: true, enum: GAME_VICTORY_API_PROPERTIES.type.enum })
  @Expose()
  public type: GameVictoryTypes;

  @ApiProperty(GAME_VICTORY_API_PROPERTIES.winners)
  @Prop({ type: [PLAYER_SCHEMA], default: undefined })
  @Type(() => Player)
  @Expose()
  public winners?: Player[];
}

const GAME_VICTORY_SCHEMA = SchemaFactory.createForClass(GameVictory);

export {
  GameVictory,
  GAME_VICTORY_SCHEMA,
};