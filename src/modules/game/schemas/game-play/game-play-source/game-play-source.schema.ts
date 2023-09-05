import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_PLAY_SOURCE_API_PROPERTIES, GAME_PLAY_SOURCE_FIELDS_SPECS } from "@/modules/game/schemas/game-play/game-play-source/game-play-source.schema.constant";
import { Player, PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";
import { GameSource } from "@/modules/game/types/game.type";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GamePlaySource {
  @ApiProperty(GAME_PLAY_SOURCE_API_PROPERTIES.name)
  @Prop({
    required: GAME_PLAY_SOURCE_FIELDS_SPECS.name.required,
    enum: GAME_PLAY_SOURCE_FIELDS_SPECS.name.enum,
  })
  @Expose()
  public name: GameSource;

  @ApiProperty(GAME_PLAY_SOURCE_API_PROPERTIES.players)
  @Prop({
    required: GAME_PLAY_SOURCE_FIELDS_SPECS.players.required,
    default: undefined,
    type: [PLAYER_SCHEMA],
  })
  @Type(() => Player)
  @Expose()
  public players?: Player[];
}

const GAME_PLAY_SOURCE_SCHEMA = SchemaFactory.createForClass(GamePlaySource);

export {
  GamePlaySource,
  GAME_PLAY_SOURCE_SCHEMA,
};