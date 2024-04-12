import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { GamePhaseName } from "@/modules/game/types/game-phase/game-phase.types";
import { PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES, PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS } from "@/modules/game/schemas/player/player-attribute/player-attribute-activation/player-attribute-activation.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerAttributeActivation {
  @ApiProperty(PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES.turn as ApiPropertyOptions)
  @Prop(PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS.turn)
  @Expose()
  public turn: number;

  @ApiProperty(PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES.phaseName as ApiPropertyOptions)
  @Prop(PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS.phaseName)
  @Expose()
  public phaseName: GamePhaseName;
}

const PLAYER_ATTRIBUTE_ACTIVATION_SCHEMA = SchemaFactory.createForClass(PlayerAttributeActivation);

export {
  PlayerAttributeActivation,
  PLAYER_ATTRIBUTE_ACTIVATION_SCHEMA,
};