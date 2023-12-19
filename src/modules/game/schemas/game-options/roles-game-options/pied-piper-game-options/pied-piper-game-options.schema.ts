import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { PIED_PIPER_GAME_OPTIONS_API_PROPERTIES, PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/pied-piper-game-options/pied-piper-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PiedPiperGameOptions {
  @ApiProperty(PIED_PIPER_GAME_OPTIONS_API_PROPERTIES.charmedPeopleCountPerNight as ApiPropertyOptions)
  @Prop(PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.charmedPeopleCountPerNight)
  @Expose()
  public charmedPeopleCountPerNight: number;

  @ApiProperty(PIED_PIPER_GAME_OPTIONS_API_PROPERTIES.isPowerlessOnWerewolvesSide as ApiPropertyOptions)
  @Prop(PIED_PIPER_GAME_OPTIONS_FIELDS_SPECS.isPowerlessOnWerewolvesSide)
  @Expose()
  public isPowerlessOnWerewolvesSide: boolean;
}

const PIED_PIPER_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(PiedPiperGameOptions);

export {
  PiedPiperGameOptions,
  PIED_PIPER_GAME_OPTIONS_SCHEMA,
};