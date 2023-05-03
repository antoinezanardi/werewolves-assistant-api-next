import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { ROLE_SIDES } from "../../../../role/enums/role.enum";
import { gameHistoryRecordPlayApiProperties, gameHistoryRecordPlayFieldsSpecs } from "../../../constants/game-history-record/game-history-record-play/game-history-record-play.constant";
import { GAME_HISTORY_RECORD_VOTING_RESULTS } from "../../../enums/game-history-record.enum";
import { GAME_PLAY_ACTIONS } from "../../../enums/game-play.enum";
import { GameAdditionalCardSchema, GameAdditionalCard } from "../../game-additional-card/game-additional-card.schema";
import { GameHistoryRecordPlaySource, GameHistoryRecordPlaySourceSchema } from "./game-history-record-play-source.schema";
import { GameHistoryRecordPlayTargetSchema } from "./game-history-record-play-target.schema";
import type { GameHistoryRecordPlayTarget } from "./game-history-record-play-target.schema";
import { GameHistoryRecordPlayVoteSchema } from "./game-history-record-play-vote.schema";
import type { GameHistoryRecordPlayVote } from "./game-history-record-play-vote.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlay {
  @ApiProperty(gameHistoryRecordPlayApiProperties.action)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.action.required,
    enum: gameHistoryRecordPlayFieldsSpecs.action.enum,
  })
  public action: GAME_PLAY_ACTIONS;

  @ApiProperty(gameHistoryRecordPlayApiProperties.source)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.source.required,
    type: GameHistoryRecordPlaySourceSchema,
  })
  public source: GameHistoryRecordPlaySource;

  @ApiProperty(gameHistoryRecordPlayApiProperties.targets)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.targets.required,
    type: [GameHistoryRecordPlayTargetSchema],
  })
  public targets?: GameHistoryRecordPlayTarget[];

  @ApiProperty(gameHistoryRecordPlayApiProperties.votes)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.votes.required,
    type: [GameHistoryRecordPlayVoteSchema],
  })
  public votes?: GameHistoryRecordPlayVote[];

  @ApiProperty(gameHistoryRecordPlayApiProperties.votingResult)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.votingResult.required,
    enum: gameHistoryRecordPlayFieldsSpecs.votingResult.enum,
  })
  public votingResult?: GAME_HISTORY_RECORD_VOTING_RESULTS;

  @ApiProperty(gameHistoryRecordPlayApiProperties.didJudgeRequestAnotherVote)
  @Prop({ required: gameHistoryRecordPlayFieldsSpecs.didJudgeRequestAnotherVote.required })
  public didJudgeRequestAnotherVote?: boolean;

  @ApiProperty(gameHistoryRecordPlayApiProperties.chosenCard)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.chosenCard.required,
    type: GameAdditionalCardSchema,
  })
  public chosenCard?: GameAdditionalCard;

  @ApiProperty(gameHistoryRecordPlayApiProperties.chosenSide)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.chosenSide.required,
    enum: gameHistoryRecordPlayFieldsSpecs.chosenSide.enum,
  })
  public chosenSide?: ROLE_SIDES;
}

const GameHistoryRecordPlaySchema = SchemaFactory.createForClass(GameHistoryRecordPlay);

export { GameHistoryRecordPlay, GameHistoryRecordPlaySchema };