import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { PIED_PIPER_GAME_OPTIONS_API_PROPERTIES, PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/pied-piper-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PiedPiperGameOptions {
  @ApiProperty(PIED_PIPER_GAME_OPTIONS_API_PROPERTIES.charmedPeopleCountPerNight)
  @Prop({
    default: PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight.default,
    min: PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight.minimum,
    max: PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight.maximum,
  })
  @Expose()
  public charmedPeopleCountPerNight: number;

  @ApiProperty(PIED_PIPER_GAME_OPTIONS_API_PROPERTIES.isPowerlessIfInfected)
  @Prop({ default: PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfInfected.default })
  @Expose()
  public isPowerlessIfInfected: boolean;
}

const PIED_PIPER_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(PiedPiperGameOptions);

export {
  PiedPiperGameOptions,
  PIED_PIPER_GAME_OPTIONS_SCHEMA,
};