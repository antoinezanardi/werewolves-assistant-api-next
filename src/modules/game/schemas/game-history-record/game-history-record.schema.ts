import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
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
  public _id: Types.ObjectId;

  @ApiProperty(gameHistoryRecordApiProperties.gameId)
  @Prop({
    type: SchemaTypes.ObjectId,
    required: gameHistoryRecordFieldsSpecs.gameId.required,
  })
  @Type(() => String)
  public gameId: Types.ObjectId;

  @ApiProperty(gameHistoryRecordApiProperties.turn)
  @Prop({
    min: gameHistoryRecordApiProperties.turn.minimum,
    required: gameHistoryRecordFieldsSpecs.turn.required,
  })
  public turn: number;

  @ApiProperty(gameHistoryRecordApiProperties.phase)
  @Prop({
    enum: gameHistoryRecordFieldsSpecs.phase.enum,
    required: gameHistoryRecordFieldsSpecs.phase.required,
  })
  public phase: GAME_PHASES;

  @ApiProperty(gameHistoryRecordApiProperties.tick)
  @Prop({ min: gameHistoryRecordApiProperties.tick.minimum })
  public tick: number;

  @ApiProperty(gameHistoryRecordApiProperties.play)
  @Prop({
    required: gameHistoryRecordFieldsSpecs.play.required,
    type: GameHistoryRecordPlaySchema,
  })
  public play: GameHistoryRecordPlay;

  @ApiProperty(gameHistoryRecordApiProperties.revealedPlayers)
  @Prop({
    required: gameHistoryRecordFieldsSpecs.revealedPlayers.required,
    type: [PlayerSchema],
  })
  public revealedPlayers?: Player[];

  @ApiProperty(gameHistoryRecordApiProperties.deadPlayers)
  @Prop({
    required: gameHistoryRecordFieldsSpecs.deadPlayers.required,
    type: [PlayerSchema],
  })
  public deadPlayers?: Player[];

  @ApiProperty(gameHistoryRecordApiProperties.createdAt)
  public createdAt: Date;

  @ApiProperty(gameHistoryRecordApiProperties.updatedAt)
  public updatedAt: Date;
}

const GameHistoryRecordSchema = SchemaFactory.createForClass(GameHistoryRecord);

type GameHistoryRecordDocument = HydratedDocument<GameHistoryRecord>;

export type { GameHistoryRecordDocument };

export { GameHistoryRecord, GameHistoryRecordSchema };