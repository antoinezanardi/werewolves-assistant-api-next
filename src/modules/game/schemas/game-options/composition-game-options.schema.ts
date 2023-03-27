import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { compositionGameOptionsApiProperties, compositionGameOptionsFieldsSpecs } from "../../constants/game-options/composition-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class CompositionGameOptions {
  @ApiProperty(compositionGameOptionsApiProperties.isHidden)
  @Prop({ default: compositionGameOptionsFieldsSpecs.isHidden.default })
  public isHidden: boolean;
}

const CompositionGameOptionsSchema = SchemaFactory.createForClass(CompositionGameOptions);

export { CompositionGameOptions, CompositionGameOptionsSchema };