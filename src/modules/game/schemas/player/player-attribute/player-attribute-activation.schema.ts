import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { playerAttributeActivationApiProperties, playerAttributeActivationFieldsSpecs } from "@/modules/game/constants/player/player-attribute/player-attribute-activation.constant";
import { GAME_PHASES } from "@/modules/game/enums/game.enum";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerAttributeActivation {
  @ApiProperty(playerAttributeActivationApiProperties.turn)
  @Prop({
    required: true,
    min: playerAttributeActivationFieldsSpecs.turn.minimum,
  })
  @Expose()
  public turn: number;

  @ApiProperty(playerAttributeActivationApiProperties.phase)
  @Prop({ required: true })
  @Expose()
  public phase: GAME_PHASES;
}

const PlayerAttributeActivationSchema = SchemaFactory.createForClass(PlayerAttributeActivation);

export { PlayerAttributeActivation, PlayerAttributeActivationSchema };