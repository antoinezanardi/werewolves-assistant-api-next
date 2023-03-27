import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { bigBadWolfGameOptionsApiProperties, bigBadWolfGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/big-bad-wolf-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class BigBadWolfGameOptions {
  @ApiProperty(bigBadWolfGameOptionsApiProperties.isPowerlessIfWerewolfDies)
  @Prop({ default: bigBadWolfGameOptionsFieldsSpecs.isPowerlessIfWerewolfDies.default })
  public isPowerlessIfWerewolfDies: boolean;
}

const BigBadWolfGameOptionsSchema = SchemaFactory.createForClass(BigBadWolfGameOptions);

export { BigBadWolfGameOptions, BigBadWolfGameOptionsSchema };