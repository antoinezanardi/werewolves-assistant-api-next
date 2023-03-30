import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { doesArrayRespectBounds } from "../../../../../shared/validation/helpers/validation.helper";
import { gameHistoryRecordPlaySourceApiProperties, gameHistoryRecordPlaySourceFieldsSpecs } from "../../../constants/game-history-record/game-history-record-play/game-history-record-play-source.constant";
import { GameSource } from "../../../types/game.type";
import type { Player } from "../../player/player.schema";
import { PlayerSchema } from "../../player/player.schema";

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
  public name: GameSource;

  @ApiProperty(gameHistoryRecordPlaySourceApiProperties.players)
  @Prop({
    required: gameHistoryRecordPlaySourceFieldsSpecs.players.required,
    validate: [(players: Player[]): boolean => doesArrayRespectBounds(players, { minItems: gameHistoryRecordPlaySourceFieldsSpecs.players.minItems }), "Path `play.source.players` length is less than minimum allowed value (1)."],
    type: [PlayerSchema],
  })
  public players: Player[];
}

const GameHistoryRecordPlaySourceSchema = SchemaFactory.createForClass(GameHistoryRecordPlaySource);

export { GameHistoryRecordPlaySource, GameHistoryRecordPlaySourceSchema };