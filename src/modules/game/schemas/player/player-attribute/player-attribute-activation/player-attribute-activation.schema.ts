import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES, PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS } from "@/modules/game/schemas/player/player-attribute/player-attribute-activation/player-attribute-activation.schema.constant";
import { GamePhases } from "@/modules/game/enums/game.enum";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerAttributeActivation {
  @ApiProperty(PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES.turn)
  @Prop({
    required: true,
    min: PLAYER_ATTRIBUTE_ACTIVATION_FIELDS_SPECS.turn.minimum,
  })
  @Expose()
  public turn: number;

  @ApiProperty(PLAYER_ATTRIBUTE_ACTIVATION_API_PROPERTIES.phase)
  @Prop({ required: true })
  @Expose()
  public phase: GamePhases;
}

const PLAYER_ATTRIBUTE_ACTIVATION_SCHEMA = SchemaFactory.createForClass(PlayerAttributeActivation);

export {
  PlayerAttributeActivation,
  PLAYER_ATTRIBUTE_ACTIVATION_SCHEMA,
};