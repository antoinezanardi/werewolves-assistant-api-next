import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SeerGameOptions {
  @ApiProperty({
    description: "If set to `true`, the game master must say out loud what the `seer` saw during her night, otherwise, he must mime the seen role to the `seer`.",
    default: defaultGameOptions.roles.seer.isTalkative,
  })
  @Prop({ default: defaultGameOptions.roles.seer.isTalkative })
  public isTalkative: boolean;

  @ApiProperty({
    description: "If set to `true`, the seer can see the exact `role` of the target, otherwise, she only sees the `side`",
    default: defaultGameOptions.roles.seer.canSeeRoles,
  })
  @Prop({ default: defaultGameOptions.roles.seer.canSeeRoles })
  public canSeeRoles: boolean;
}

const SeerGameOptionsSchema = SchemaFactory.createForClass(SeerGameOptions);

export { SeerGameOptions, SeerGameOptionsSchema };