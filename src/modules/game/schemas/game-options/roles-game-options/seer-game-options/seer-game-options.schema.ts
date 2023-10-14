import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { SEER_GAME_OPTIONS_API_PROPERTIES, SEER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/seer-game-options/seer-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SeerGameOptions {
  @ApiProperty(SEER_GAME_OPTIONS_API_PROPERTIES.isTalkative as ApiPropertyOptions)
  @Prop(SEER_GAME_OPTIONS_FIELDS_SPECS.isTalkative)
  @Expose()
  public isTalkative: boolean;

  @ApiProperty(SEER_GAME_OPTIONS_API_PROPERTIES.canSeeRoles as ApiPropertyOptions)
  @Prop(SEER_GAME_OPTIONS_FIELDS_SPECS.isTalkative)
  @Expose()
  public canSeeRoles: boolean;
}

const SEER_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(SeerGameOptions);

export {
  SeerGameOptions,
  SEER_GAME_OPTIONS_SCHEMA,
};