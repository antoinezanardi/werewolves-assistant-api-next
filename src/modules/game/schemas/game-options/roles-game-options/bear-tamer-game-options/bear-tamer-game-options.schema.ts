import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES, BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/bear-tamer-game-options/bear-tamer-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class BearTamerGameOptions {
  @ApiProperty(BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES.doesGrowlOnWerewolvesSide as ApiPropertyOptions)
  @Prop(BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS.doesGrowlOnWerewolvesSide)
  @Expose()
  public doesGrowlOnWerewolvesSide: boolean;
}

const BEAR_TAMER_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(BearTamerGameOptions);

export {
  BearTamerGameOptions,
  BEAR_TAMER_GAME_OPTIONS_SCHEMA,
};