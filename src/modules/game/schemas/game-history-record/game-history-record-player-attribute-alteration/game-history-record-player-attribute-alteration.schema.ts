import { GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_API_PROPERTIES, GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_FIELDS_SPECS } from "@/modules/game/schemas/game-history-record/game-history-record-player-attribute-alteration/game-history-record-player-attribute-alteration.constants";
import { GameHistoryRecordPlayerAttributeAlterationStatus } from "@/modules/game/types/game-history-record/game-history-record.types";
import { GameSource } from "@/modules/game/types/game.types";
import { PlayerAttributeName } from "@/modules/game/types/player/player-attribute/player-attribute.types";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, type ApiPropertyOptions } from "@nestjs/swagger";
import { Expose } from "class-transformer";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GameHistoryRecordPlayerAttributeAlteration {
  @ApiProperty(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_API_PROPERTIES.name as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_FIELDS_SPECS.name)
  @Expose()
  public name: PlayerAttributeName;

  @ApiProperty(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_API_PROPERTIES.source as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_FIELDS_SPECS.source)
  @Expose()
  public source: GameSource;

  @ApiProperty(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_API_PROPERTIES.playerName as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_FIELDS_SPECS.playerName)
  @Expose()
  public playerName: string;

  @ApiProperty(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_API_PROPERTIES.status as ApiPropertyOptions)
  @Prop(GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_FIELDS_SPECS.status)
  @Expose()
  public status: GameHistoryRecordPlayerAttributeAlterationStatus;
}

const GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_SCHEMA = SchemaFactory.createForClass(GameHistoryRecordPlayerAttributeAlteration);

export {
  GameHistoryRecordPlayerAttributeAlteration,
  GAME_HISTORY_RECORD_PLAYER_ATTRIBUTE_ALTERATION_SCHEMA,
};