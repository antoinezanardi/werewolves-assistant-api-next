import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { dogWolfGameOptionsApiProperties, dogWolfGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/dog-wolf-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class DogWolfGameOptions {
  @ApiProperty(dogWolfGameOptionsApiProperties.isChosenSideRevealed)
  @Prop({ default: dogWolfGameOptionsFieldsSpecs.isChosenSideRevealed.default })
  public isChosenSideRevealed: boolean;
}

const DogWolfGameOptionsSchema = SchemaFactory.createForClass(DogWolfGameOptions);

export { DogWolfGameOptions, DogWolfGameOptionsSchema };