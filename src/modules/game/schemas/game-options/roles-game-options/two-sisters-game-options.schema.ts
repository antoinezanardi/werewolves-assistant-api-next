import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { TWO_SISTERS_GAME_OPTIONS_API_PROPERTIES, TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/two-sisters-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class TwoSistersGameOptions {
  @ApiProperty(TWO_SISTERS_GAME_OPTIONS_API_PROPERTIES.wakingUpInterval)
  @Prop({
    default: TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.default,
    min: TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.minimum,
    max: TWO_SISTERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.maximum,
  })
  @Expose()
  public wakingUpInterval: number;
}

const TWO_SISTERS_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(TwoSistersGameOptions);

export {
  TwoSistersGameOptions,
  TWO_SISTERS_GAME_OPTIONS_SCHEMA,
};