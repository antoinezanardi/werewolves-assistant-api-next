import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { RoleSide } from "@/modules/role/types/role.types";
import { GameAdditionalCard } from "@/modules/game/schemas/game-additional-card/game-additional-card.schema";
import { GameHistoryRecordPlaySource } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-source/game-history-record-play-source.schema";
import { GameHistoryRecordPlayTarget } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target/game-history-record-play-target.schema";
import { GameHistoryRecordPlayVote } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-vote/game-history-record-play-vote.schema";
import { GameHistoryRecordPlayVoting } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-voting/game-history-record-play-voting.schema";
import { GAME_HISTORY_RECORD_PLAY_API_PROPERTIES, GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema.constants";
import { GamePlayAction, GamePlayCause, GamePlayType } from "@/modules/game/types/game-play/game-play.types";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlay {
  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.type as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.type)
  @Expose()
  public type: GamePlayType;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.action as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.action)
  @Expose()
  public action: GamePlayAction;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.source as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.source)
  @Type(() => GameHistoryRecordPlaySource)
  @Expose()
  public source: GameHistoryRecordPlaySource;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.causes as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.causes)
  @Expose()
  public causes?: GamePlayCause[];

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.targets as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.targets)
  @Type(() => GameHistoryRecordPlayTarget)
  @Expose()
  public targets?: GameHistoryRecordPlayTarget[];

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.votes as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.votes)
  @Type(() => GameHistoryRecordPlayVote)
  @Expose()
  public votes?: GameHistoryRecordPlayVote[];

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.voting as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.voting)
  @Type(() => GameHistoryRecordPlayVoting)
  @Expose()
  public voting?: GameHistoryRecordPlayVoting;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.didJudgeRequestAnotherVote as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.didJudgeRequestAnotherVote)
  @Expose()
  public didJudgeRequestAnotherVote?: boolean;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.chosenCard as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.chosenCard)
  @Type(() => GameAdditionalCard)
  @Expose()
  public chosenCard?: GameAdditionalCard;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_API_PROPERTIES.chosenSide as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_FIELDS_SPECS.chosenSide)
  @Expose()
  public chosenSide?: RoleSide;
}

const GAME_HISTORY_RECORD_PLAY_SCHEMA = SchemaFactory.createForClass(GameHistoryRecordPlay);

export {
  GameHistoryRecordPlay,
  GAME_HISTORY_RECORD_PLAY_SCHEMA,
};