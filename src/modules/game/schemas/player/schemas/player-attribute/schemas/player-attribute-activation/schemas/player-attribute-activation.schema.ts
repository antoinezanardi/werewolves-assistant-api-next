import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { GAME_PHASES } from "../../../../../../../enums/game.enum";
import { playerAttributeActivationApiProperties, playerAttributeActivationFieldsSpecs } from "../constants/player-attribute-activation.constant";

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
  public turn: number;

  @ApiProperty(playerAttributeActivationApiProperties.phase)
  @Prop({ required: true })
  public phase: GAME_PHASES;
}

const PlayerAttributeActivationSchema = SchemaFactory.createForClass(PlayerAttributeActivation);

export { PlayerAttributeActivation, PlayerAttributeActivationSchema };