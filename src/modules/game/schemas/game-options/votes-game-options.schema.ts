import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { votesGameOptionsApiProperties, votesGameOptionsFieldsSpecs } from "../../constants/game-options/votes-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class VotesGameOptions {
  @ApiProperty(votesGameOptionsApiProperties.canBeSkipped)
  @Prop({ default: votesGameOptionsFieldsSpecs.canBeSkipped.default })
  @Expose()
  public canBeSkipped: boolean;
}

const VotesGameOptionsSchema = SchemaFactory.createForClass(VotesGameOptions);

export {
  VotesGameOptions,
  VotesGameOptionsSchema,
};