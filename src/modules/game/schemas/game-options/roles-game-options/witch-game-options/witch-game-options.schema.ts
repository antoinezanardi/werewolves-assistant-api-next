import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { WITCH_GAME_OPTIONS_API_PROPERTIES, WITCH_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/witch-game-options/witch-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class WitchGameOptions {
  @ApiProperty(WITCH_GAME_OPTIONS_API_PROPERTIES.doesKnowWerewolvesTargets as ApiPropertyOptions)
  @Prop(WITCH_GAME_OPTIONS_FIELDS_SPECS.doesKnowWerewolvesTargets)
  @Expose()
  public doesKnowWerewolvesTargets: boolean;
}

const WITCH_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(WitchGameOptions);

export {
  WitchGameOptions,
  WITCH_GAME_OPTIONS_SCHEMA,
};