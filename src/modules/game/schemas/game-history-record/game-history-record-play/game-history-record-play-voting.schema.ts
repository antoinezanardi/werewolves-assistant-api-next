import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_HISTORY_RECORD_PLAY_VOTING_API_PROPERTIES, GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting.schema.constant";
import { GameHistoryRecordVotingResults } from "@/modules/game/enums/game-history-record.enum";
import { Player, PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlayVoting {
  @ApiProperty(GAME_HISTORY_RECORD_PLAY_VOTING_API_PROPERTIES.result)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS.result.required,
    enum: GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS.result.enum,
  })
  @Expose()
  public result: GameHistoryRecordVotingResults;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_VOTING_API_PROPERTIES.nominatedPlayers)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_VOTING_FIELDS_SPECS.nominatedPlayers.required,
    type: [PLAYER_SCHEMA],
    default: undefined,
  })
  @Type(() => Player)
  @Expose()
  public nominatedPlayers?: Player[];
}

const GAME_HISTORY_RECORD_PLAY_VOTING_SCHEMA = SchemaFactory.createForClass(GameHistoryRecordPlayVoting);

export {
  GameHistoryRecordPlayVoting,
  GAME_HISTORY_RECORD_PLAY_VOTING_SCHEMA,
};