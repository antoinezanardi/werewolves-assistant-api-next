import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { gameHistoryRecordPlayVoteFieldsSpecs } from "../../../constants/game-history-record/game-history-record-play/game-history-record-play-vote.constant";
import { Player, PlayerSchema } from "../../player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlayVote {
  @ApiProperty(gameHistoryRecordPlayVoteFieldsSpecs.source)
  @Prop({
    required: gameHistoryRecordPlayVoteFieldsSpecs.source.required,
    type: PlayerSchema,
  })
  public source: Player;

  @ApiProperty(gameHistoryRecordPlayVoteFieldsSpecs.target)
  @Prop({
    required: gameHistoryRecordPlayVoteFieldsSpecs.target.required,
    type: PlayerSchema,
  })
  public target: Player;
}

const GameHistoryRecordPlayVoteSchema = SchemaFactory.createForClass(GameHistoryRecordPlayVote);

export { GameHistoryRecordPlayVote, GameHistoryRecordPlayVoteSchema };