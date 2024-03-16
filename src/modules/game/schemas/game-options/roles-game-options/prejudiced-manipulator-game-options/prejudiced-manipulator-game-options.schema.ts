import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { PREJUDICED_MANIPULATOR_GAME_OPTIONS_API_PROPERTIES, PREJUDICED_MANIPULATOR_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/prejudiced-manipulator-game-options/prejudiced-manipulator-game-options.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class PrejudicedManipulatorGameOptions {
  @ApiProperty(PREJUDICED_MANIPULATOR_GAME_OPTIONS_API_PROPERTIES.isPowerlessOnWerewolvesSide as ApiPropertyOptions)
  @Prop(PREJUDICED_MANIPULATOR_GAME_OPTIONS_FIELDS_SPECS.isPowerlessOnWerewolvesSide)
  @Expose()
  public isPowerlessOnWerewolvesSide: boolean;
}

const PREJUDICED_MANIPULATOR_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(PrejudicedManipulatorGameOptions);

export {
  PrejudicedManipulatorGameOptions,
  PREJUDICED_MANIPULATOR_GAME_OPTIONS_SCHEMA,
};