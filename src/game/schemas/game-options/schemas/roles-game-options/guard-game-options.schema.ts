import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { guardGameOptionsApiProperties } from "../../constants/roles-game-options/guard-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GuardGameOptions {
  @ApiProperty(guardGameOptionsApiProperties.canProtectTwice)
  @Prop({ default: guardGameOptionsApiProperties.canProtectTwice.default as boolean })
  public canProtectTwice: boolean;
}

const GuardGameOptionsSchema = SchemaFactory.createForClass(GuardGameOptions);

export { GuardGameOptions, GuardGameOptionsSchema };