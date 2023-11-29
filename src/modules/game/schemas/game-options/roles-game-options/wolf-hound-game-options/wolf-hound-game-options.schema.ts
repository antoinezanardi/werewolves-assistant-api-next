import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { WOLF_HOUND_GAME_OPTIONS_API_PROPERTIES, WOLF_HOUND_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/wolf-hound-game-options/wolf-hound-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class WolfHoundGameOptions {
  @ApiProperty(WOLF_HOUND_GAME_OPTIONS_API_PROPERTIES.isChosenSideRevealed as ApiPropertyOptions)
  @Prop(WOLF_HOUND_GAME_OPTIONS_FIELDS_SPECS.isChosenSideRevealed)
  @Expose()
  public isChosenSideRevealed: boolean;

  @ApiProperty(WOLF_HOUND_GAME_OPTIONS_API_PROPERTIES.isSideRandomlyChosen as ApiPropertyOptions)
  @Prop(WOLF_HOUND_GAME_OPTIONS_FIELDS_SPECS.isSideRandomlyChosen)
  public isSideRandomlyChosen: boolean;
}

const WOLF_HOUND_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(WolfHoundGameOptions);

export {
  WolfHoundGameOptions,
  WOLF_HOUND_GAME_OPTIONS_SCHEMA,
};