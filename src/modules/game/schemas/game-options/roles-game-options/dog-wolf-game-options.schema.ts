import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { dogWolfGameOptionsApiProperties, dogWolfGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/dog-wolf-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class DogWolfGameOptions {
  @ApiProperty(dogWolfGameOptionsApiProperties.isChosenSideRevealed)
  @Prop({ default: dogWolfGameOptionsFieldsSpecs.isChosenSideRevealed.default })
  @Expose()
  public isChosenSideRevealed: boolean;
}

const DogWolfGameOptionsSchema = SchemaFactory.createForClass(DogWolfGameOptions);

export { DogWolfGameOptions, DogWolfGameOptionsSchema };