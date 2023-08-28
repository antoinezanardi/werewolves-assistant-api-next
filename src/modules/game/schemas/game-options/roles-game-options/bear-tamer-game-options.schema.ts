import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES, BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/bear-tamer-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class BearTamerGameOptions {
  @ApiProperty(BEAR_TAMER_GAME_OPTIONS_API_PROPERTIES.doesGrowlIfInfected)
  @Prop({ default: BEAR_TAMER_GAME_OPTIONS_FIELDS_SPECS.doesGrowlIfInfected.default })
  @Expose()
  public doesGrowlIfInfected: boolean;
}

const BEAR_TAMER_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(BearTamerGameOptions);

export {
  BearTamerGameOptions,
  BEAR_TAMER_GAME_OPTIONS_SCHEMA,
};