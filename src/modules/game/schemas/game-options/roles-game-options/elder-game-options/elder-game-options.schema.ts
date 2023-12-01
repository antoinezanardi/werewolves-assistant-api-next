import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { ELDER_GAME_OPTIONS_API_PROPERTIES, ELDER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/elder-game-options/elder-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class ElderGameOptions {
  @ApiProperty(ELDER_GAME_OPTIONS_API_PROPERTIES.livesCountAgainstWerewolves as ApiPropertyOptions)
  @Prop(ELDER_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves)
  @Expose()
  public livesCountAgainstWerewolves: number;

  @ApiProperty(ELDER_GAME_OPTIONS_API_PROPERTIES.doesTakeHisRevenge as ApiPropertyOptions)
  @Prop(ELDER_GAME_OPTIONS_FIELDS_SPECS.doesTakeHisRevenge)
  @Expose()
  public doesTakeHisRevenge: boolean;
}

const ELDER_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(ElderGameOptions);

export {
  ElderGameOptions,
  ELDER_GAME_OPTIONS_SCHEMA,
};