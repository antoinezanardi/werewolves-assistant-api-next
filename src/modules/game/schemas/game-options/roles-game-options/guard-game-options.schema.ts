import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { GUARD_GAME_OPTIONS_API_PROPERTIES, GUARD_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/guard-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GuardGameOptions {
  @ApiProperty(GUARD_GAME_OPTIONS_API_PROPERTIES.canProtectTwice)
  @Prop({ default: GUARD_GAME_OPTIONS_FIELDS_SPECS.canProtectTwice.default })
  @Expose()
  public canProtectTwice: boolean;
}

const GUARD_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(GuardGameOptions);

export {
  GuardGameOptions,
  GUARD_GAME_OPTIONS_SCHEMA,
};