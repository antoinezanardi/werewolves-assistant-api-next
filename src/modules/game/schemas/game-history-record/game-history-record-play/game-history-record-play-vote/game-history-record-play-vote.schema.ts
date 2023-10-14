import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_HISTORY_RECORD_PLAY_VOTE_API_PROPERTIES, GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote/game-history-record-play-vote.schema.constant";
import { Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlayVote {
  @ApiProperty(GAME_HISTORY_RECORD_PLAY_VOTE_API_PROPERTIES.source as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS.source)
  @Type(() => Player)
  @Expose()
  public source: Player;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_VOTE_API_PROPERTIES.target as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS.target)
  @Type(() => Player)
  @Expose()
  public target: Player;
}

const GAME_HISTORY_RECORD_PLAY_VOTE_SCHEMA = SchemaFactory.createForClass(GameHistoryRecordPlayVote);

export {
  GameHistoryRecordPlayVote,
  GAME_HISTORY_RECORD_PLAY_VOTE_SCHEMA,
};