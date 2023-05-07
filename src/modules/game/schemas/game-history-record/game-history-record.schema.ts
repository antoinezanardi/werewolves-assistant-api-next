import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { SchemaTypes, Types } from "mongoose";
import type { HydratedDocument } from "mongoose";
import { gameHistoryRecordApiProperties, gameHistoryRecordFieldsSpecs } from "../../constants/game-history-record/game-history-record.constant";
import { GAME_PHASES } from "../../enums/game.enum";
import type { Player } from "../player/player.schema";
import { PlayerSchema } from "../player/player.schema";
import { GameHistoryRecordPlay, GameHistoryRecordPlaySchema } from "./game-history-record-play/game-history-record-play.schema";

@Schema({
  timestamps: true,
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
  @Expose()
  public play: GameHistoryRecordPlay;

  @ApiProperty(gameHistoryRecordApiProperties.revealedPlayers)
  @Prop({
    required: gameHistoryRecordFieldsSpecs.revealedPlayers.required,
    type: [PlayerSchema],
    default: undefined,
  })
  @Expose()
  public revealedPlayers?: Player[];

  @ApiProperty(gameHistoryRecordApiProperties.deadPlayers)
  @Prop({
    required: gameHistoryRecordFieldsSpecs.deadPlayers.required,
    type: [PlayerSchema],
    default: undefined,
  })
  @Expose()
  public deadPlayers?: Player[];

  @ApiProperty(gameHistoryRecordApiProperties.createdAt)
  @Expose()
  public createdAt: Date;

  @ApiProperty(gameHistoryRecordApiProperties.updatedAt)
  @Expose()
  public updatedAt: Date;
}

const GameHistoryRecordSchema = SchemaFactory.createForClass(GameHistoryRecord);

type GameHistoryRecordDocument = HydratedDocument<GameHistoryRecord>;

export type { GameHistoryRecordDocument };

export { GameHistoryRecord, GameHistoryRecordSchema };