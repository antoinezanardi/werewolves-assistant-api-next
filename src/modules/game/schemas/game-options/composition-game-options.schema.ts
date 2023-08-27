import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { compositionGameOptionsApiProperties, compositionGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/composition-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class CompositionGameOptions {
  @ApiProperty(compositionGameOptionsApiProperties.isHidden)
  @Prop({ default: compositionGameOptionsFieldsSpecs.isHidden.default })
  @Expose()
  public isHidden: boolean;
}

const CompositionGameOptionsSchema = SchemaFactory.createForClass(CompositionGameOptions);

export { CompositionGameOptions, CompositionGameOptionsSchema };