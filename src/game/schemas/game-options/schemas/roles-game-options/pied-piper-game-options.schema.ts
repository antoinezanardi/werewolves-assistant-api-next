import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { piedPiperGameOptionsApiProperties } from "../../constants/roles-game-options/pied-piper-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PiedPiperGameOptions {
  @ApiProperty(piedPiperGameOptionsApiProperties.charmedPeopleCountPerNight)
  @Prop({
    default: piedPiperGameOptionsApiProperties.charmedPeopleCountPerNight.default as number,
    min: piedPiperGameOptionsApiProperties.charmedPeopleCountPerNight.minimum,
    max: piedPiperGameOptionsApiProperties.charmedPeopleCountPerNight.maximum,
  })
  public charmedPeopleCountPerNight: number;

  @ApiProperty(piedPiperGameOptionsApiProperties.isPowerlessIfInfected)
  @Prop({ default: piedPiperGameOptionsApiProperties.isPowerlessIfInfected.default as boolean })
  public isPowerlessIfInfected: boolean;
}

const PiedPiperGameOptionsSchema = SchemaFactory.createForClass(PiedPiperGameOptions);

export { PiedPiperGameOptions, PiedPiperGameOptionsSchema };