import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class DogWolfGameOptions {
  @ApiProperty({
    description: "If set to `true`, when `dog-wolf` chooses his side at the beginning of the game, the game master will announce the chosen side to other players",
    default: defaultGameOptions.roles.dogWolf.isChosenSideRevealed,
  })
  @Prop({ default: defaultGameOptions.roles.dogWolf.isChosenSideRevealed })
  public isChosenSideRevealed: boolean;
}

const DogWolfGameOptionsSchema = SchemaFactory.createForClass(DogWolfGameOptions);

export { DogWolfGameOptions, DogWolfGameOptionsSchema };