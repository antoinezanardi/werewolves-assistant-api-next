import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { PLAYER_ATTRIBUTE_API_PROPERTIES, PLAYER_ATTRIBUTE_FIELDS_SPECS } from "@/modules/game/schemas/player/player-attribute/player-attribute.schema.constant";
import { PlayerAttributeNames } from "@/modules/game/enums/player.enum";
import { PlayerAttributeActivation } from "@/modules/game/schemas/player/player-attribute/player-attribute-activation/player-attribute-activation.schema";
import { GameSource } from "@/modules/game/types/game.type";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerAttribute {
  @ApiProperty(PLAYER_ATTRIBUTE_API_PROPERTIES.name as ApiPropertyOptions)
  @Prop(PLAYER_ATTRIBUTE_FIELDS_SPECS.name)
  @Expose()
  public name: PlayerAttributeNames;

  @ApiProperty(PLAYER_ATTRIBUTE_API_PROPERTIES.source as ApiPropertyOptions)
  @Prop(PLAYER_ATTRIBUTE_FIELDS_SPECS.source)
  @Expose()
  public source: GameSource;

  @ApiProperty(PLAYER_ATTRIBUTE_API_PROPERTIES.remainingPhases as ApiPropertyOptions)
  @Prop(PLAYER_ATTRIBUTE_FIELDS_SPECS.remainingPhases)
  @Expose()
  public remainingPhases?: number;

  @ApiProperty(PLAYER_ATTRIBUTE_API_PROPERTIES.activeAt as ApiPropertyOptions)
  @Prop(PLAYER_ATTRIBUTE_FIELDS_SPECS.activeAt)
  @Type(() => PlayerAttributeActivation)
  @Expose()
  public activeAt?: PlayerAttributeActivation;

  @ApiProperty(PLAYER_ATTRIBUTE_API_PROPERTIES.doesRemainAfterDeath as ApiPropertyOptions)
  @Prop(PLAYER_ATTRIBUTE_FIELDS_SPECS.doesRemainAfterDeath)
  @Expose()
  public doesRemainAfterDeath?: boolean;
}

const PLAYER_ATTRIBUTE_SCHEMA = SchemaFactory.createForClass(PlayerAttribute);

export {
  PlayerAttribute,
  PLAYER_ATTRIBUTE_SCHEMA,
};