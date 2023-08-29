import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { SchemaTypes, Types } from "mongoose";

import { GAME_HISTORY_RECORD_API_PROPERTIES, GAME_HISTORY_RECORD_FIELDS_SPECS } from "@/modules/game/constants/game-history-record/game-history-record.constant";
import { GamePhases } from "@/modules/game/enums/game.enum";
import { GameHistoryRecordPlay, GAME_HISTORY_RECORD_PLAY_SCHEMA } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { PLAYER_SCHEMA, Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
})
class GameHistoryRecord {
  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES._id)
  @Type(() => String)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.gameId)
  @Prop({
    type: SchemaTypes.ObjectId,
    required: GAME_HISTORY_RECORD_FIELDS_SPECS.gameId.required,
  })
  @Type(() => String)
  @Expose()
  public gameId: Types.ObjectId;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.turn)
  @Prop({
    min: GAME_HISTORY_RECORD_API_PROPERTIES.turn.minimum,
    required: GAME_HISTORY_RECORD_FIELDS_SPECS.turn.required,
  })
  @Expose()
  public turn: number;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.phase)
  @Prop({
    enum: GAME_HISTORY_RECORD_FIELDS_SPECS.phase.enum,
    required: GAME_HISTORY_RECORD_FIELDS_SPECS.phase.required,
  })
  @Expose()
  public phase: GamePhases;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.tick)
  @Prop({ min: GAME_HISTORY_RECORD_API_PROPERTIES.tick.minimum })
  @Expose()
  public tick: number;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.play)
  @Prop({
    required: GAME_HISTORY_RECORD_FIELDS_SPECS.play.required,
    type: GAME_HISTORY_RECORD_PLAY_SCHEMA,
  })
  @Type(() => GameHistoryRecordPlay)
  @Expose()
  public play: GameHistoryRecordPlay;

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.revealedPlayers)
  @Prop({
    required: GAME_HISTORY_RECORD_FIELDS_SPECS.revealedPlayers.required,
    type: [PLAYER_SCHEMA],
    default: undefined,
  })
  @Type(() => Player)
  @Expose()
  public revealedPlayers?: Player[];

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.deadPlayers)
  @Prop({
    required: GAME_HISTORY_RECORD_FIELDS_SPECS.deadPlayers.required,
    type: [PLAYER_SCHEMA],
    default: undefined,
  })
  @Type(() => Player)
  @Expose()
  public deadPlayers?: Player[];

  @ApiProperty(GAME_HISTORY_RECORD_API_PROPERTIES.createdAt)
  @Type(() => Date)
  @Expose()
  public createdAt: Date;
}

const GAME_HISTORY_RECORD_SCHEMA = SchemaFactory.createForClass(GameHistoryRecord);

export {
  GameHistoryRecord,
  GAME_HISTORY_RECORD_SCHEMA,
};