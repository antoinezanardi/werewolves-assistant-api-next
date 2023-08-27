import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { piedPiperGameOptionsApiProperties, piedPiperGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/pied-piper-game-options.constant";

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
  @Expose()
  public charmedPeopleCountPerNight: number;

  @ApiProperty(piedPiperGameOptionsApiProperties.isPowerlessIfInfected)
  @Prop({ default: piedPiperGameOptionsFieldsSpecs.isPowerlessIfInfected.default })
  @Expose()
  public isPowerlessIfInfected: boolean;
}

const PiedPiperGameOptionsSchema = SchemaFactory.createForClass(PiedPiperGameOptions);

export { PiedPiperGameOptions, PiedPiperGameOptionsSchema };