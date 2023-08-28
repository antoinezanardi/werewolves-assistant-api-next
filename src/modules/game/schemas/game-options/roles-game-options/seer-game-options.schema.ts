import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { SEER_GAME_OPTIONS_API_PROPERTIES, SEER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/seer-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SeerGameOptions {
  @ApiProperty(SEER_GAME_OPTIONS_API_PROPERTIES.isTalkative)
  @Prop({ default: SEER_GAME_OPTIONS_FIELDS_SPECS.isTalkative.default })
  @Expose()
  public isTalkative: boolean;

  @ApiProperty(SEER_GAME_OPTIONS_API_PROPERTIES.canSeeRoles)
  @Prop({ default: SEER_GAME_OPTIONS_FIELDS_SPECS.canSeeRoles.default })
  @Expose()
  public canSeeRoles: boolean;
}

const SEER_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(SeerGameOptions);

export {
  SeerGameOptions,
  SEER_GAME_OPTIONS_SCHEMA,
};