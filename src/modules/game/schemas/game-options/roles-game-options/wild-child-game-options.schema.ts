import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { wildChildGameOptionsApiProperties, wildChildGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/wild-child-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class WildChildGameOptions {
  @ApiProperty(wildChildGameOptionsApiProperties.isTransformationRevealed)
  @Prop({ default: wildChildGameOptionsFieldsSpecs.isTransformationRevealed.default })
  public isTransformationRevealed: boolean;
}

const WildChildGameOptionsSchema = SchemaFactory.createForClass(WildChildGameOptions);

export { WildChildGameOptions, WildChildGameOptionsSchema };