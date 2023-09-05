import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { RAVEN_GAME_OPTIONS_API_PROPERTIES, RAVEN_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/raven-game-options/raven-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class RavenGameOptions {
  @ApiProperty(RAVEN_GAME_OPTIONS_API_PROPERTIES.markPenalty)
  @Prop({
    default: RAVEN_GAME_OPTIONS_FIELDS_SPECS.markPenalty.default,
    min: RAVEN_GAME_OPTIONS_FIELDS_SPECS.markPenalty.minimum,
    max: RAVEN_GAME_OPTIONS_FIELDS_SPECS.markPenalty.maximum,
  })
  @Expose()
  public markPenalty: number;
}

const RAVEN_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(RavenGameOptions);

export {
  RavenGameOptions,
  RAVEN_GAME_OPTIONS_SCHEMA,
};