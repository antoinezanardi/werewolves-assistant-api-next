import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { DOG_WOLF_GAME_OPTIONS_API_PROPERTIES, DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/dog-wolf-game-options/dog-wolf-game-options.schema.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class DogWolfGameOptions {
  @ApiProperty(DOG_WOLF_GAME_OPTIONS_API_PROPERTIES.isChosenSideRevealed as ApiPropertyOptions)
  @Prop(DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS.isChosenSideRevealed)
  @Expose()
  public isChosenSideRevealed: boolean;
}

const DOG_WOLF_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(DogWolfGameOptions);

export {
  DogWolfGameOptions,
  DOG_WOLF_GAME_OPTIONS_SCHEMA,
};