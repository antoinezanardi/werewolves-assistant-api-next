import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { guardGameOptionsApiProperties, guardGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/guard-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class GuardGameOptions {
  @ApiProperty(guardGameOptionsApiProperties.canProtectTwice)
  @Prop({ default: guardGameOptionsFieldsSpecs.canProtectTwice.default })
  @Expose()
  public canProtectTwice: boolean;
}

const GuardGameOptionsSchema = SchemaFactory.createForClass(GuardGameOptions);

export { GuardGameOptions, GuardGameOptionsSchema };