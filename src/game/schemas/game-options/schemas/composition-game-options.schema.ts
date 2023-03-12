import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { compositionGameOptionsApiProperties } from "../constants/composition-game-options.constant";
import { defaultGameOptions } from "../constants/game-options.constant";

@Schema({ versionKey: false, id: false, _id: false })
class CompositionGameOptions {
  @ApiProperty(compositionGameOptionsApiProperties.isHidden)
  @Prop({ default: defaultGameOptions.composition.isHidden })
  public isHidden: boolean;
}

const CompositionGameOptionsSchema = SchemaFactory.createForClass(CompositionGameOptions);

export { CompositionGameOptions, CompositionGameOptionsSchema };