import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { gameHistoryRecordPlayTargetApiProperties, gameHistoryRecordPlayTargetFieldsSpecs } from "../../../constants/game-history-record/game-history-record-play/game-history-record-play-target.constant";
import { WITCH_POTIONS } from "../../../enums/game-play.enum";
import { Player, PlayerSchema } from "../../player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlayTarget {
  @ApiProperty(gameHistoryRecordPlayTargetApiProperties.player)
  @Prop({
    required: gameHistoryRecordPlayTargetFieldsSpecs.player.required,
    type: PlayerSchema,
  })
  @Type(() => Player)
  @Expose()
  public player: Player;

  @ApiProperty(gameHistoryRecordPlayTargetApiProperties.isInfected)
  @Prop({ required: gameHistoryRecordPlayTargetFieldsSpecs.isInfected.required })
  @Expose()
  public isInfected?: boolean;

  @ApiProperty(gameHistoryRecordPlayTargetApiProperties.drankPotion)
  @Prop({
    required: gameHistoryRecordPlayTargetFieldsSpecs.drankPotion.required,
    enum: gameHistoryRecordPlayTargetFieldsSpecs.drankPotion.enum,
  })
  @Expose()
  public drankPotion?: WITCH_POTIONS;
}

const GameHistoryRecordPlayTargetSchema = SchemaFactory.createForClass(GameHistoryRecordPlayTarget);

export { GameHistoryRecordPlayTarget, GameHistoryRecordPlayTargetSchema };