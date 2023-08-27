import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { SchemaTypes, Types } from "mongoose";
import type { HydratedDocument } from "mongoose";

import { gameHistoryRecordApiProperties, gameHistoryRecordFieldsSpecs } from "@/modules/game/constants/game-history-record/game-history-record.constant";
import { GAME_PHASES } from "@/modules/game/enums/game.enum";
import { GameHistoryRecordPlay, GameHistoryRecordPlaySchema } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play.schema";
import { PlayerSchema, Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
})
class GameHistoryRecord {
  @ApiProperty(gameHistoryRecordApiProperties._id)
  @Type(() => String)
  @Expose()
  public _id: Types.ObjectId;

  @ApiProperty(gameHistoryRecordApiProperties.gameId)
  @Prop({
    type: SchemaTypes.ObjectId,
    required: gameHistoryRecordFieldsSpecs.gameId.required,
  })
  @Type(() => String)
  @Expose()
  public gameId: Types.ObjectId;

  @ApiProperty(gameHistoryRecordApiProperties.turn)
  @Prop({
    min: gameHistoryRecordApiProperties.turn.minimum,
    required: gameHistoryRecordFieldsSpecs.turn.required,
  })
  @Expose()
  public turn: number;

  @ApiProperty(gameHistoryRecordApiProperties.phase)
  @Prop({
    enum: gameHistoryRecordFieldsSpecs.phase.enum,
    required: gameHistoryRecordFieldsSpecs.phase.required,
  })
  @Expose()
  public phase: GAME_PHASES;

  @ApiProperty(gameHistoryRecordApiProperties.tick)
  @Prop({ min: gameHistoryRecordApiProperties.tick.minimum })
  @Expose()
  public tick: number;

  @ApiProperty(gameHistoryRecordApiProperties.play)
  @Prop({
    required: gameHistoryRecordFieldsSpecs.play.required,
    type: GameHistoryRecordPlaySchema,
  })
  @Type(() => GameHistoryRecordPlay)
  @Expose()
  public play: GameHistoryRecordPlay;

  @ApiProperty(gameHistoryRecordApiProperties.revealedPlayers)
  @Prop({
    required: gameHistoryRecordFieldsSpecs.revealedPlayers.required,
    type: [PlayerSchema],
    default: undefined,
  })
  @Type(() => Player)
  @Expose()
  public revealedPlayers?: Player[];

  @ApiProperty(gameHistoryRecordApiProperties.deadPlayers)
  @Prop({
    required: gameHistoryRecordFieldsSpecs.deadPlayers.required,
    type: [PlayerSchema],
    default: undefined,
  })
  @Type(() => Player)
  @Expose()
  public deadPlayers?: Player[];

  @ApiProperty(gameHistoryRecordApiProperties.createdAt)
  @Type(() => Date)
  @Expose()
  public createdAt: Date;
}

const GameHistoryRecordSchema = SchemaFactory.createForClass(GameHistoryRecord);

type GameHistoryRecordDocument = HydratedDocument<GameHistoryRecord>;

export type { GameHistoryRecordDocument };

export { GameHistoryRecord, GameHistoryRecordSchema };