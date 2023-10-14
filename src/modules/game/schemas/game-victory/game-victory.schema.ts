import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_VICTORY_API_PROPERTIES, GAME_VICTORY_FIELDS_SPECS } from "@/modules/game/schemas/game-victory/game-victory.schema.constant";
import { GameVictoryTypes } from "@/modules/game/enums/game-victory.enum";
import { Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameVictory {
  @ApiProperty(GAME_VICTORY_API_PROPERTIES.type as ApiPropertyOptions)
  @Prop(GAME_VICTORY_FIELDS_SPECS.type)
  @Expose()
  public type: GameVictoryTypes;

  @ApiProperty(GAME_VICTORY_API_PROPERTIES.winners as ApiPropertyOptions)
  @Prop(GAME_VICTORY_FIELDS_SPECS.winners)
  @Type(() => Player)
  @Expose()
  public winners?: Player[];
}

const GAME_VICTORY_SCHEMA = SchemaFactory.createForClass(GameVictory);

export {
  GameVictory,
  GAME_VICTORY_SCHEMA,
};