import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { THREE_BROTHERS_GAME_OPTIONS_API_PROPERTIES, THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/three-brothers-game-options/three-brothers-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class ThreeBrothersGameOptions {
  @ApiProperty(THREE_BROTHERS_GAME_OPTIONS_API_PROPERTIES.wakingUpInterval as ApiPropertyOptions)
  @Prop(THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval)
  @Expose()
  public wakingUpInterval: number;
}

const THREE_BROTHERS_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(ThreeBrothersGameOptions);

export {
  ThreeBrothersGameOptions,
  THREE_BROTHERS_GAME_OPTIONS_SCHEMA,
};