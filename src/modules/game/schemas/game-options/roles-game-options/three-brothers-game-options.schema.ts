import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { THREE_BROTHERS_GAME_OPTIONS_API_PROPERTIES, THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/three-brothers-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class ThreeBrothersGameOptions {
  @ApiProperty(THREE_BROTHERS_GAME_OPTIONS_API_PROPERTIES.wakingUpInterval)
  @Prop({
    default: THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.default,
    min: THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.minimum,
    max: THREE_BROTHERS_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.maximum,
  })
  @Expose()
  public wakingUpInterval: number;
}

const THREE_BROTHERS_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(ThreeBrothersGameOptions);

export {
  ThreeBrothersGameOptions,
  THREE_BROTHERS_GAME_OPTIONS_SCHEMA,
};