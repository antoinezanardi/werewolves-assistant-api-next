import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { COMPOSITION_GAME_OPTIONS_API_PROPERTIES, COMPOSITION_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/composition-game-options/composition-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class CompositionGameOptions {
  @ApiProperty(COMPOSITION_GAME_OPTIONS_API_PROPERTIES.isHidden)
  @Prop({ default: COMPOSITION_GAME_OPTIONS_FIELDS_SPECS.isHidden.default })
  @Expose()
  public isHidden: boolean;
}

const COMPOSITION_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(CompositionGameOptions);

export {
  CompositionGameOptions,
  COMPOSITION_GAME_OPTIONS_SCHEMA,
};