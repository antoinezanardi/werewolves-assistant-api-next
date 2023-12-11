import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

import { CUPID_GAME_OPTIONS_API_PROPERTIES, CUPID_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/cupid-game-options/cupid-game-options.schema.constant";
import { CupidLoversGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/cupid-game-options/cupid-lovers-game-options/cupid-game-options.schema";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class CupidGameOptions {
  @ApiProperty(CUPID_GAME_OPTIONS_API_PROPERTIES.lovers as ApiPropertyOptions)
  @Prop(CUPID_GAME_OPTIONS_FIELDS_SPECS.lovers)
  @Type(() => CupidLoversGameOptions)
  @Expose()
  public lovers: CupidLoversGameOptions;
}

const CUPID_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(CupidGameOptions);

export {
  CupidGameOptions,
  CUPID_GAME_OPTIONS_SCHEMA,
};