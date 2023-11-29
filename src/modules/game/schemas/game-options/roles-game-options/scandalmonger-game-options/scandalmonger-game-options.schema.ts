import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { SCANDALMONGER_GAME_OPTIONS_API_PROPERTIES, SCANDALMONGER_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/scandalmonger-game-options/scandalmonger-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class ScandalmongerGameOptions {
  @ApiProperty(SCANDALMONGER_GAME_OPTIONS_API_PROPERTIES.markPenalty as ApiPropertyOptions)
  @Prop(SCANDALMONGER_GAME_OPTIONS_FIELDS_SPECS.markPenalty)
  @Expose()
  public markPenalty: number;
}

const SCANDALMONGER_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(ScandalmongerGameOptions);

export {
  ScandalmongerGameOptions,
  SCANDALMONGER_GAME_OPTIONS_SCHEMA,
};