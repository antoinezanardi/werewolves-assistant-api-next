import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GuardGameOptions {
  @ApiProperty({
    description: "If set to `true`, the guard can protect twice in a row the same target",
    default: defaultGameOptions.roles.guard.canProtectTwice,
  })
  @Prop({ default: defaultGameOptions.roles.guard.canProtectTwice })
  public canProtectTwice: boolean;
}

const GuardGameOptionsSchema = SchemaFactory.createForClass(GuardGameOptions);

export { GuardGameOptions, GuardGameOptionsSchema };