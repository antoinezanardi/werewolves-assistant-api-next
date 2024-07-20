import { GameEvent } from "@/modules/game/schemas/game-event/game-event.schema";
import { GameHistoryRecordPlayerAttributeAlteration } from "@/modules/game/schemas/game-history-record/game-history-record-player-attribute-alteration/game-history-record-player-attribute-alteration.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { Types } from "mongoose";

import { GamePhase } from "@/modules/game/schemas/game-phase/game-phase.schema";
import { DeadPlayer } from "@/modules/game/schemas/player/dead-player.schema";
import { GAME_HISTORY_RECORD_API_PROPERTIES, GAME_HISTORY_RECORD_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record.schema.constants";
import { GameHistoryRecordPlay } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { Player } from "@/modules/game/schemas/player/player.schema";

import { toObjectId } from "@/shared/validation/transformers/validation.transformer";

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
})
class GameHistoryRecord {
  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES._id as ApiPropertyOptions)
  @Transform(toObjectId)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.gameId as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_FIELDS_SPECS.gameId)
  @Type(() => String)
  @Expose()
  public gameId: Types.ObjectId;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.turn as ApiPropertyOptions)
  @Prop({
    min: GAME_HISTORY_RECORD_API_PROPERTIES.turn.minimum,
    required: GAME_HISTORY_RECORD_FIELDS_SPECS.turn.required,
  })
  @Expose()
  public turn: number;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.phase as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_FIELDS_SPECS.phase)
  @Type(() => GamePhase)
  @Expose()
  public phase: GamePhase;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.tick as ApiPropertyOptions)
  @Prop({ min: GAME_HISTORY_RECORD_API_PROPERTIES.tick.minimum })
  @Expose()
  public tick: number;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.play as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_FIELDS_SPECS.play)
  @Type(() => GameHistoryRecordPlay)
  @Expose()
  public play: GameHistoryRecordPlay;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.revealedPlayers as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_FIELDS_SPECS.revealedPlayers)
  @Type(() => Player)
  @Expose()
  public revealedPlayers?: Player[];

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.switchedSidePlayers as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_FIELDS_SPECS.switchedSidePlayers)
  @Type(() => Player)
  @Expose()
  public switchedSidePlayers?: Player[];

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.deadPlayers as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_FIELDS_SPECS.deadPlayers)
  @Type(() => DeadPlayer)
  @Expose()
  public deadPlayers?: DeadPlayer[];

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.playerAttributeAlterations as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_FIELDS_SPECS.playerAttributeAlterations)
  @Type(() => GameHistoryRecordPlayerAttributeAlteration)
  @Expose()
  public playerAttributeAlterations?: GameHistoryRecordPlayerAttributeAlteration[];

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.events as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_FIELDS_SPECS.events)
  @Type(() => GameEvent)
  @Expose()
  public events?: GameEvent[];

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.createdAt as ApiPropertyOptions)
  @Type(() => Date)
  @Expose()
  public createdAt: Date;
}

const GAME_HISTORY_RECORD_SCHEMA = SchemaFactory.createForClass(GameHistoryRecord);

export {
  GameHistoryRecord,
  GAME_HISTORY_RECORD_SCHEMA,
};