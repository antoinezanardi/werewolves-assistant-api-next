import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { THIEF_GAME_OPTIONS_API_PROPERTIES, THIEF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/thief-game-options/thief-game-options.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class ThiefGameOptions {
  @ApiProperty(THIEF_GAME_OPTIONS_API_PROPERTIES.mustChooseBetweenWerewolves as ApiPropertyOptions)
  @Prop(THIEF_GAME_OPTIONS_FIELDS_SPECS.mustChooseBetweenWerewolves)
  @Expose()
  public mustChooseBetweenWerewolves: boolean;

  @ApiProperty(THIEF_GAME_OPTIONS_API_PROPERTIES.isChosenCardRevealed as ApiPropertyOptions)
  @Prop(THIEF_GAME_OPTIONS_FIELDS_SPECS.isChosenCardRevealed)
  @Expose()
  public isChosenCardRevealed: boolean;
}

const THIEF_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(ThiefGameOptions);

export {
  ThiefGameOptions,
  THIEF_GAME_OPTIONS_SCHEMA,
};