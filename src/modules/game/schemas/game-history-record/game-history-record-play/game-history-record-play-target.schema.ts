import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_HISTORY_RECORD_PLAY_TARGET_API_PROPERTIES, GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target.schema.constant";
import { WitchPotions } from "@/modules/game/enums/game-play.enum";
import { Player, PLAYER_SCHEMA } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlayTarget {
  @ApiProperty(GAME_HISTORY_RECORD_PLAY_TARGET_API_PROPERTIES.player)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS.player.required,
    type: PLAYER_SCHEMA,
  })
  @Type(() => Player)
  @Expose()
  public player: Player;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_TARGET_API_PROPERTIES.isInfected)
  @Prop({ required: GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS.isInfected.required })
  @Expose()
  public isInfected?: boolean;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_TARGET_API_PROPERTIES.drankPotion)
  @Prop({
    required: GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS.drankPotion.required,
    enum: GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS.drankPotion.enum,
  })
  @Expose()
  public drankPotion?: WitchPotions;
}

const GAME_HISTORY_RECORD_PLAY_TARGET_SCHEMA = SchemaFactory.createForClass(GameHistoryRecordPlayTarget);

export {
  GameHistoryRecordPlayTarget,
  GAME_HISTORY_RECORD_PLAY_TARGET_SCHEMA,
};