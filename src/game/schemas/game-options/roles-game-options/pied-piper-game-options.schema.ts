import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Max, Min } from "class-validator";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PiedPiperGameOptions {
  @ApiProperty({
    description: "Number of `charmed` people by the `pied piper` per night if there are enough targets (or number of not charmed players otherwise)",
    default: defaultGameOptions.roles.piedPiper.charmedPeopleCountPerNight,
  })
  @Min(1)
  @Max(5)
  @Prop({
    default: defaultGameOptions.roles.piedPiper.charmedPeopleCountPerNight,
    min: 1,
    max: 5,
  })
  public charmedPeopleCountPerNight: number;

  @ApiProperty({
    description: "If set to `true`, `pied piper` will be `powerless` if he is infected by the `vile father of wolves`",
    default: defaultGameOptions.roles.piedPiper.isPowerlessIfInfected,
  })
  @Prop({ default: defaultGameOptions.roles.piedPiper.isPowerlessIfInfected })
  public isPowerlessIfInfected: boolean;
}

const PiedPiperGameOptionsSchema = SchemaFactory.createForClass(PiedPiperGameOptions);

export { PiedPiperGameOptions, PiedPiperGameOptionsSchema };