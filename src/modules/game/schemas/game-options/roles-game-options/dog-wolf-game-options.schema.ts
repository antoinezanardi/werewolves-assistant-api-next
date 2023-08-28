import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { DOG_WOLF_GAME_OPTIONS_API_PROPERTIES, DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/dog-wolf-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class DogWolfGameOptions {
  @ApiProperty(DOG_WOLF_GAME_OPTIONS_API_PROPERTIES.isChosenSideRevealed)
  @Prop({ default: DOG_WOLF_GAME_OPTIONS_FIELDS_SPECS.isChosenSideRevealed.default })
  @Expose()
  public isChosenSideRevealed: boolean;
}

const DOG_WOLF_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(DogWolfGameOptions);

export {
  DogWolfGameOptions,
  DOG_WOLF_GAME_OPTIONS_SCHEMA,
};