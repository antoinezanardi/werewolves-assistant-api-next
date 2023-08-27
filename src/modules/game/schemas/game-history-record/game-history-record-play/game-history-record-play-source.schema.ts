import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { gameHistoryRecordPlaySourceApiProperties, gameHistoryRecordPlaySourceFieldsSpecs } from "@/modules/game/constants/game-history-record/game-history-record-play/game-history-record-play-source.constant";
import { PlayerSchema, Player } from "@/modules/game/schemas/player/player.schema";
import { GameSource } from "@/modules/game/types/game.type";

import { doesArrayRespectBounds } from "@/shared/validation/helpers/validation.helper";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlaySource {
  @ApiProperty(gameHistoryRecordPlaySourceApiProperties.name)
  @Prop({
    required: gameHistoryRecordPlaySourceFieldsSpecs.name.required,
    enum: gameHistoryRecordPlaySourceFieldsSpecs.name.enum,
  })
  @Expose()
  public name: GameSource;

  @ApiProperty(gameHistoryRecordPlaySourceApiProperties.players)
  @Prop({
    required: gameHistoryRecordPlaySourceFieldsSpecs.players.required,
    validate: [(players: Player[]): boolean => doesArrayRespectBounds(players, { minItems: gameHistoryRecordPlaySourceFieldsSpecs.players.minItems }), "Path `play.source.players` length is less than minimum allowed value (1)."],
    type: [PlayerSchema],
  })
  @Type(() => Player)
  @Expose()
  public players: Player[];
}

const GameHistoryRecordPlaySourceSchema = SchemaFactory.createForClass(GameHistoryRecordPlaySource);

export { GameHistoryRecordPlaySource, GameHistoryRecordPlaySourceSchema };