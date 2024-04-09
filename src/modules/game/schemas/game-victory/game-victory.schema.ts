import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GameVictoryType } from "@/modules/game/types/game-victory/game-victory.types";
import { GAME_VICTORY_API_PROPERTIES, GAME_VICTORY_FIELDS_SPECS } from "@/modules/game/schemas/game-victory/game-victory.schema.constants";
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
  public type: GameVictoryType;

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