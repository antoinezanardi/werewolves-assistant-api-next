import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { TWO_SISTERS_GAME_OPTIONS_API_PROPERTIES, TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/two-sisters-game-options/two-sisters-game-options.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class TwoSistersGameOptions {
  @ApiProperty(TWO_SISTERS_GAME_OPTIONS_API_PROPERTIES.wakingUpInterval as ApiPropertyOptions)
  @Prop(TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval)
  @Expose()
  public wakingUpInterval: number;
}

const TWO_SISTERS_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(TwoSistersGameOptions);

export {
  TwoSistersGameOptions,
  TWO_SISTERS_GAME_OPTIONS_SCHEMA,
};