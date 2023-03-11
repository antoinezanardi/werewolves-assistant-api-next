import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class BearTamerGameOptions {
  @ApiProperty({
    description: "If set to `true`, the bear tamer will have the `growls` attribute until he dies if he is `infected`",
    default: defaultGameOptions.roles.bearTamer.doesGrowlIfInfected,
  })
  @Prop({ default: defaultGameOptions.roles.bearTamer.doesGrowlIfInfected })
  public doesGrowlIfInfected: boolean;
}

const BearTamerGameOptionsSchema = SchemaFactory.createForClass(BearTamerGameOptions);

export { BearTamerGameOptions, BearTamerGameOptionsSchema };