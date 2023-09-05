import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES, GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source.schema.constant";
import { PLAYER_SCHEMA, Player } from "@/modules/game/schemas/player/player.schema";
import { GameSource } from "@/modules/game/types/game.type";

import { doesArrayRespectBounds } from "@/shared/validation/helpers/validation.helper";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlaySource {
  @ApiProperty(GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES.name)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.name.required,
    enum: GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.name.enum,
  })
  @Expose()
  public name: GameSource;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES.players)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.players.required,
    validate: [(players: Player[]): boolean => doesArrayRespectBounds(players, { minItems: GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.players.minItems }), "Path `play.source.players` length is less than minimum allowed value (1)."],
    type: [PLAYER_SCHEMA],
  })
  @Type(() => Player)
  @Expose()
  public players: Player[];
}

const GAME_HISTORY_RECORD_PLAY_SOURCE_SCHEMA = SchemaFactory.createForClass(GameHistoryRecordPlaySource);

export {
  GameHistoryRecordPlaySource,
  GAME_HISTORY_RECORD_PLAY_SOURCE_SCHEMA,
};