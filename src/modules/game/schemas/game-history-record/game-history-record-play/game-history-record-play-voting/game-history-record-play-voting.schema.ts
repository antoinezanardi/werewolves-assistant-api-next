import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_HISTORY_RECORD_PLAY_VOTING_API_PROPERTIES, GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema.constant";
import { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import { Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlayVoting {
  @ApiProperty(GAME_HISTORY_RECORD_PLAY_VOTING_API_PROPERTIES.result as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS.result)
  @Expose()
  public result: GameHistoryRecordVotingResults;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_VOTING_API_PROPERTIES.nominatedPlayers as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS.nominatedPlayers)
  @Type(() => Player)
  @Expose()
  public nominatedPlayers?: Player[];
}

const GAME_HISTORY_RECORD_PLAY_VOTING_SCHEMA = SchemaFactory.createForClass(GameHistoryRecordPlayVoting);

export {
  GameHistoryRecordPlayVoting,
  GAME_HISTORY_RECORD_PLAY_VOTING_SCHEMA,
};