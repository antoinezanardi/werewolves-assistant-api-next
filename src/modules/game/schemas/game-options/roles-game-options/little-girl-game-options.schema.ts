import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { LITTLE_GIRL_GAME_OPTIONS_API_PROPERTIES, LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS } from "@/modules/game/constants/game-options/roles-game-options/little-girl-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class LittleGirlGameOptions {
  @ApiProperty(LITTLE_GIRL_GAME_OPTIONS_API_PROPERTIES.isProtectedByGuard)
  @Prop({ default: LITTLE_GIRL_GAME_OPTIONS_SPECS_FIELDS.isProtectedByGuard.default })
  @Expose()
  public isProtectedByGuard: boolean;
}

const LITTLE_GIRL_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(LittleGirlGameOptions);

export {
  LittleGirlGameOptions,
  LITTLE_GIRL_GAME_OPTIONS_SCHEMA,
};