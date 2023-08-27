import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { gameHistoryRecordPlayVotingApiProperties, gameHistoryRecordPlayVotingFieldsSpecs } from "@/modules/game/constants/game-history-record/game-history-record-play/game-history-record-play-voting.constant";
import { GAME_HISTORY_RECORD_VOTING_RESULTS } from "@/modules/game/enums/game-history-record.enum";
import { Player, PlayerSchema } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlayVoting {
  @ApiProperty(gameHistoryRecordPlayVotingApiProperties.result)
  @Prop({
    required: gameHistoryRecordPlayVotingFieldsSpecs.result.required,
    enum: gameHistoryRecordPlayVotingFieldsSpecs.result.enum,
  })
  @Expose()
  public result: GAME_HISTORY_RECORD_VOTING_RESULTS;

  @ApiProperty(gameHistoryRecordPlayVotingApiProperties.nominatedPlayers)
  @Prop({
    required: gameHistoryRecordPlayVotingFieldsSpecs.nominatedPlayers.required,
    type: [PlayerSchema],
    default: undefined,
  })
  @Type(() => Player)
  @Expose()
  public nominatedPlayers?: Player[];
}

const GameHistoryRecordPlayVotingSchema = SchemaFactory.createForClass(GameHistoryRecordPlayVoting);

export { GameHistoryRecordPlayVoting, GameHistoryRecordPlayVotingSchema };