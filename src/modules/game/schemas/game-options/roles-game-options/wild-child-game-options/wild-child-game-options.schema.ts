import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { WILD_CHILD_GAME_OPTIONS_API_PROPERTIES, WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/wild-child-game-options/wild-child-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class WildChildGameOptions {
  @ApiProperty(WILD_CHILD_GAME_OPTIONS_API_PROPERTIES.isTransformationRevealed as ApiPropertyOptions)
  @Prop(WILD_CHILD_GAME_OPTIONS_FIELDS_SPECS.isTransformationRevealed)
  @Expose()
  public isTransformationRevealed: boolean;
}

const WILD_CHILD_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(WildChildGameOptions);

export {
  WildChildGameOptions,
  WILD_CHILD_GAME_OPTIONS_SCHEMA,
};