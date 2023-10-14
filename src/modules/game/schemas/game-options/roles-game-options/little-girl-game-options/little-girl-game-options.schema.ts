import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { LITTLE_GIRL_GAME_OPTIONS_API_PROPERTIES, LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS } from "@/modules/game/schemas/game-options/roles-game-options/little-girl-game-options/little-girl-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class LittleGirlGameOptions {
  @ApiProperty(LITTLE_GIRL_GAME_OPTIONS_API_PROPERTIES.isProtectedByGuard as ApiPropertyOptions)
  @Prop(LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS.isProtectedByGuard)
  @Expose()
  public isProtectedByGuard: boolean;
}

const LITTLE_GIRL_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(LittleGirlGameOptions);

export {
  LittleGirlGameOptions,
  LITTLE_GIRL_GAME_OPTIONS_SCHEMA,
};