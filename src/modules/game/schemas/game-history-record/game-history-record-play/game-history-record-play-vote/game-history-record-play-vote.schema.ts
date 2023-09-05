import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote/game-history-record-play-vote.schema.constant";
import { Player, PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlayVote {
  @ApiProperty(GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS.source)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS.source.required,
    type: PLAYER_SCHEMA,
  })
  @Type(() => Player)
  @Expose()
  public source: Player;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS.target)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_VOTE_FIELDS_SPECS.target.required,
    type: PLAYER_SCHEMA,
  })
  @Type(() => Player)
  @Expose()
  public target: Player;
}

const GAME_HISTORY_RECORD_PLAY_VOTE_SCHEMA = SchemaFactory.createForClass(GameHistoryRecordPlayVote);

export {
  GameHistoryRecordPlayVote,
  GAME_HISTORY_RECORD_PLAY_VOTE_SCHEMA,
};