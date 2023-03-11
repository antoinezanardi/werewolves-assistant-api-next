import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class IdiotGameOptions {
  @ApiProperty({
    description: "If set to `true`, the idiot will die if his role is revealed and the ancient just died. ",
    default: defaultGameOptions.roles.idiot.doesDieOnAncientDeath,
  })
  @Prop({ default: defaultGameOptions.roles.idiot.doesDieOnAncientDeath })
  public doesDieOnAncientDeath: boolean;
}

const IdiotGameOptionsSchema = SchemaFactory.createForClass(IdiotGameOptions);

export { IdiotGameOptions, IdiotGameOptionsSchema };