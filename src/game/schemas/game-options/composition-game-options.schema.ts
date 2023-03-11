import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../constants/game-options/game-options.constant";

@Schema({ versionKey: false, id: false, _id: false })
class CompositionGameOptions {
  @ApiProperty({
    description: "If set to `true`, game's composition will be hidden to all players",
    default: defaultGameOptions.composition.isHidden,
  })
  @Prop({ default: defaultGameOptions.composition.isHidden })
  public isHidden: boolean;
}

const CompositionGameOptionsSchema = SchemaFactory.createForClass(CompositionGameOptions);

export { CompositionGameOptions, CompositionGameOptionsSchema };