import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { GAME_HISTORY_RECORD_PLAY_TARGET_API_PROPERTIES, GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record-play/game-history-record-play-target/game-history-record-play-target.schema.constant";
import { WitchPotions } from "@/modules/game/enums/game-play.enum";
import { Player } from "@/modules/game/schemas/player/player.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlayTarget {
  @ApiProperty(GAME_HISTORY_RECORD_PLAY_TARGET_API_PROPERTIES.player as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS.player)
  @Type(() => Player)
  @Expose()
  public player: Player;

  @ApiProperty(GAME_HISTORY_RECORD_PLAY_TARGET_API_PROPERTIES.drankPotion as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAY_TARGET_FIELDS_SPECS.drankPotion)
  @Expose()
  public drankPotion?: WitchPotions;
}

const GAME_HISTORY_RECORD_PLAY_TARGET_SCHEMA = SchemaFactory.createForClass(GameHistoryRecordPlayTarget);

export {
  GameHistoryRecordPlayTarget,
  GAME_HISTORY_RECORD_PLAY_TARGET_SCHEMA,
};