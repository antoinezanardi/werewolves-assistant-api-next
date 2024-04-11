import type { PropOptions } from "@nestjs/mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GamePlaySourceInteraction } from "@/modules/game/schemas/game-play/game-play-source/game-play-source-interaction/game-play-source-interaction.schema";
import { GamePlaySourceName } from "@/modules/game/types/game-play/game-play.types";
import { GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES, GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema.constants";
import { Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlaySource {
  @ApiProperty(GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES.name as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.name)
  @Expose()
  public name: GamePlaySourceName;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES.players as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.players as PropOptions)
  @Type(() => Player)
  @Expose()
  public players: Player[];

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_SOURCE_API_PROPERTIES.interactions as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_SOURCE_FIELDS_SPECS.interactions as PropOptions)
  @Type(() => GamePlaySourceInteraction)
  @Expose()
  public interactions?: GamePlaySourceInteraction[];
}

const GAME_HISTORY_RECORD_PLAY_SOURCE_SCHEMA = SchemaFactory.createForClass(GameHistoryRecordPlaySource);

export {
  GameHistoryRecordPlaySource,
  GAME_HISTORY_RECORD_PLAY_SOURCE_SCHEMA,
};