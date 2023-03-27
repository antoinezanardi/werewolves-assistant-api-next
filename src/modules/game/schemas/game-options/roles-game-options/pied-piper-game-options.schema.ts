import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { piedPiperGameOptionsApiProperties, piedPiperGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/pied-piper-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PiedPiperGameOptions {
  @ApiProperty(piedPiperGameOptionsApiProperties.charmedPeopleCountPerNight)
  @Prop({
    default: piedPiperGameOptionsFieldsSpecs.charmedPeopleCountPerNight.default,
    min: piedPiperGameOptionsFieldsSpecs.charmedPeopleCountPerNight.minimum,
    max: piedPiperGameOptionsFieldsSpecs.charmedPeopleCountPerNight.maximum,
  })
  public charmedPeopleCountPerNight: number;

  @ApiProperty(piedPiperGameOptionsApiProperties.isPowerlessIfInfected)
  @Prop({ default: piedPiperGameOptionsFieldsSpecs.isPowerlessIfInfected.default })
  public isPowerlessIfInfected: boolean;
}

const PiedPiperGameOptionsSchema = SchemaFactory.createForClass(PiedPiperGameOptions);

export { PiedPiperGameOptions, PiedPiperGameOptionsSchema };