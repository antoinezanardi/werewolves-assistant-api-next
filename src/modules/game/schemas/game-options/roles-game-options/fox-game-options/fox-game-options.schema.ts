import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { FOX_GAME_OPTIONS_API_PROPERTIES, FOX_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/fox-game-options/fox-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class FoxGameOptions {
  @ApiProperty(FOX_GAME_OPTIONS_API_PROPERTIES.isPowerlessIfMissesWerewolf as ApiPropertyOptions)
  @Prop(FOX_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfMissesWerewolf)
  @Expose()
  public isPowerlessIfMissesWerewolf: boolean;
}

const FOX_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(FoxGameOptions);

export {
  FoxGameOptions,
  FOX_GAME_OPTIONS_SCHEMA,
};