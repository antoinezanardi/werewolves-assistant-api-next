import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { playerAttributeApiProperties, playerAttributeFieldsSpecs } from "../constants/player-attribute.constant";
import { PLAYER_ATTRIBUTE_NAMES } from "../enums/player-attribute.enum";
import { PlayerAttributeSource } from "../types/player-attribute.type";
import { PlayerAttributeActivation, PlayerAttributeActivationSchema } from "./player-attribute-activation/schemas/player-attribute-activation.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PlayerAttribute {
  @ApiProperty(playerAttributeApiProperties.name)
  @Prop({ required: true })
  public name: PLAYER_ATTRIBUTE_NAMES;

  @ApiProperty(playerAttributeApiProperties.source)
  @Prop({ required: true })
  public source: PlayerAttributeSource;

  @ApiProperty(playerAttributeApiProperties.remainingPhases)
  @Prop({ min: playerAttributeFieldsSpecs.remainingPhases.minimum })
  public remainingPhases?: number;

  @ApiProperty(playerAttributeApiProperties.activeAt)
  @Prop({ type: PlayerAttributeActivationSchema })
  public activeAt?: PlayerAttributeActivation;
}

const PlayerAttributeSchema = SchemaFactory.createForClass(PlayerAttribute);

export { PlayerAttribute, PlayerAttributeSchema };