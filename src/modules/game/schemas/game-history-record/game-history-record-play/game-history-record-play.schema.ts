import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_HISTORY_RECORD_PLAY_API_PROPERTIES, GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS } from "@/modules/game/constants/game-history-record/game-history-record-play/game-history-record-play.constant";
import { GamePlayActions, GamePlayCauses } from "@/modules/game/enums/game-play.enum";
import { GAME_ADDITIONAL_CARD_SCHEMA, GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { GameHistoryRecordPlaySource, GAME_HISTORY_RECORD_PLAY_SOURCE_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source.schema";
import { GAME_HISTORY_RECORD_PLAY_TARGET_SCHEMA, GameHistoryRecordPlayTarget } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target.schema";
import { GAME_HISTORY_RECORD_PLAY_VOTE_SCHEMA, GameHistoryRecordPlayVote } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote.schema";
import { GameHistoryRecordPlayVoting, GAME_HISTORY_RECORD_PLAY_VOTING_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting.schema";
import { RoleSides } from "@/modules/role/enums/role.enum";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlay {
  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.action)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.action.required,
    enum: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.action.enum,
  })
  @Expose()
  public action: GamePlayActions;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.source)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.source.required,
    type: GAME_HISTORY_RECORD_PLAY_SOURCE_SCHEMA,
  })
  @Type(() => GameHistoryRecordPlaySource)
  @Expose()
  public source: GameHistoryRecordPlaySource;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.cause)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.cause.required,
    enum: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.cause.enum,
  })
  @Expose()
  public cause?: GamePlayCauses;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.targets)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.targets.required,
    type: [GAME_HISTORY_RECORD_PLAY_TARGET_SCHEMA],
    default: undefined,
  })
  @Type(() => GameHistoryRecordPlayTarget)
  @Expose()
  public targets?: GameHistoryRecordPlayTarget[];

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.votes)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.votes.required,
    type: [GAME_HISTORY_RECORD_PLAY_VOTE_SCHEMA],
    default: undefined,
  })
  @Type(() => GameHistoryRecordPlayVote)
  @Expose()
  public votes?: GameHistoryRecordPlayVote[];

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.voting)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.voting.required,
    type: GAME_HISTORY_RECORD_PLAY_VOTING_SCHEMA,
  })
  @Type(() => GameHistoryRecordPlayVoting)
  @Expose()
  public voting?: GameHistoryRecordPlayVoting;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.didJudgeRequestAnotherVote)
  @Prop({ required: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.didJudgeRequestAnotherVote.required })
  @Expose()
  public didJudgeRequestAnotherVote?: boolean;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.chosenCard)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.chosenCard.required,
    type: GAME_ADDITIONAL_CARD_SCHEMA,
  })
  @Type(() => GameAdditionalCard)
  @Expose()
  public chosenCard?: GameAdditionalCard;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.chosenSide)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.chosenSide.required,
    enum: GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.chosenSide.enum,
  })
  @Expose()
  public chosenSide?: RoleSides;
}

const GAME_HISTORY_RECORD_PLAY_SCHEMA = SchemaFactory.createForClass(GameHistoryRecordPlay);

export {
  GameHistoryRecordPlay,
  GAME_HISTORY_RECORD_PLAY_SCHEMA,
};