import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { gameHistoryRecordPlayApiProperties, gameHistoryRecordPlayFieldsSpecs } from "@/modules/game/constants/game-history-record/game-history-record-play/game-history-record-play.constant";
import { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES } from "@/modules/game/enums/game-play.enum";
import { GameAdditionalCardSchema, GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { GameHistoryRecordPlaySource, GameHistoryRecordPlaySourceSchema } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source.schema";
import { GameHistoryRecordPlayTargetSchema, GameHistoryRecordPlayTarget } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target.schema";
import { GameHistoryRecordPlayVoteSchema, GameHistoryRecordPlayVote } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote.schema";
import { GameHistoryRecordPlayVoting, GameHistoryRecordPlayVotingSchema } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting.schema";
import { ROLE_SIDES } from "@/modules/role/enums/role.enum";

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
  @Expose()
  public action: GAME_PLAY_ACTIONS;

  @ApiProperty(gameHistoryRecordPlayApiProperties.source)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.source.required,
    type: GameHistoryRecordPlaySourceSchema,
  })
  @Type(() => GameHistoryRecordPlaySource)
  @Expose()
  public source: GameHistoryRecordPlaySource;

  @ApiProperty(gameHistoryRecordPlayApiProperties.cause)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.cause.required,
    enum: gameHistoryRecordPlayFieldsSpecs.cause.enum,
  })
  @Expose()
  public cause?: GAME_PLAY_CAUSES;

  @ApiProperty(gameHistoryRecordPlayApiProperties.targets)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.targets.required,
    type: [GameHistoryRecordPlayTargetSchema],
    default: undefined,
  })
  @Type(() => GameHistoryRecordPlayTarget)
  @Expose()
  public targets?: GameHistoryRecordPlayTarget[];

  @ApiProperty(gameHistoryRecordPlayApiProperties.votes)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.votes.required,
    type: [GameHistoryRecordPlayVoteSchema],
    default: undefined,
  })
  @Type(() => GameHistoryRecordPlayVote)
  @Expose()
  public votes?: GameHistoryRecordPlayVote[];

  @ApiProperty(gameHistoryRecordPlayApiProperties.voting)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.voting.required,
    type: GameHistoryRecordPlayVotingSchema,
  })
  @Type(() => GameHistoryRecordPlayVoting)
  @Expose()
  public voting?: GameHistoryRecordPlayVoting;

  @ApiProperty(gameHistoryRecordPlayApiProperties.didJudgeRequestAnotherVote)
  @Prop({ required: gameHistoryRecordPlayFieldsSpecs.didJudgeRequestAnotherVote.required })
  @Expose()
  public didJudgeRequestAnotherVote?: boolean;

  @ApiProperty(gameHistoryRecordPlayApiProperties.chosenCard)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.chosenCard.required,
    type: GameAdditionalCardSchema,
  })
  @Type(() => GameAdditionalCard)
  @Expose()
  public chosenCard?: GameAdditionalCard;

  @ApiProperty(gameHistoryRecordPlayApiProperties.chosenSide)
  @Prop({
    required: gameHistoryRecordPlayFieldsSpecs.chosenSide.required,
    enum: gameHistoryRecordPlayFieldsSpecs.chosenSide.enum,
  })
  @Expose()
  public chosenSide?: ROLE_SIDES;
}

const GameHistoryRecordPlaySchema = SchemaFactory.createForClass(GameHistoryRecordPlay);

export { GameHistoryRecordPlay, GameHistoryRecordPlaySchema };