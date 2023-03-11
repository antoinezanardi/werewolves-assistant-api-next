import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class BigBadWolfGameOptions {
  @ApiProperty({
    description: "If set to `true`, the bear tamer will have the `growls` attribute until he dies if he is `infected`",
    default: defaultGameOptions.roles.bigBadWolf.isPowerlessIfWerewolfDies,
  })
  @Prop({ default: defaultGameOptions.roles.bigBadWolf.isPowerlessIfWerewolfDies })
  public isPowerlessIfWerewolfDies: boolean;
}

const BigBadWolfGameOptionsSchema = SchemaFactory.createForClass(BigBadWolfGameOptions);

export { BigBadWolfGameOptions, BigBadWolfGameOptionsSchema };