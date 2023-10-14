import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GamePlaySourceName } from "@/modules/game/types/game-play.type";
import { GAME_PLAY_SOURCE_API_PROPERTIES, GAME_PLAY_SOURCE_FIELDS_SPECS } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema.constant";
import { Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlaySource {
  @ApiProperty(GAME_PLAY_SOURCE_API_PROPERTIES.name as ApiPropertyOptions)
  @Prop(GAME_PLAY_SOURCE_FIELDS_SPECS.name)
  @Expose()
  public name: GamePlaySourceName;

  @ApiProperty(GAME_PLAY_SOURCE_API_PROPERTIES.players as ApiPropertyOptions)
  @Prop(GAME_PLAY_SOURCE_FIELDS_SPECS.players)
  @Type(() => Player)
  @Expose()
  public players?: Player[];
}

const GAME_PLAY_SOURCE_SCHEMA = SchemaFactory.createForClass(GamePlaySource);

export {
  GamePlaySource,
  GAME_PLAY_SOURCE_SCHEMA,
};