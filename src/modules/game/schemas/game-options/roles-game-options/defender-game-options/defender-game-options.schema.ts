import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { DEFENDER_GAME_OPTIONS_API_PROPERTIES, DEFENDER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/defender-game-options/defender-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class DefenderGameOptions {
  @ApiProperty(DEFENDER_GAME_OPTIONS_API_PROPERTIES.canProtectTwice as ApiPropertyOptions)
  @Prop(DEFENDER_GAME_OPTIONS_FIELDS_SPECS.canProtectTwice)
  @Expose()
  public canProtectTwice: boolean;
}

const DEFENDER_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(DefenderGameOptions);

export {
  DefenderGameOptions,
  DEFENDER_GAME_OPTIONS_SCHEMA,
};