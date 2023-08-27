import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { seerGameOptionsApiProperties, seerGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/seer-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SeerGameOptions {
  @ApiProperty(seerGameOptionsApiProperties.isTalkative)
  @Prop({ default: seerGameOptionsFieldsSpecs.isTalkative.default })
  @Expose()
  public isTalkative: boolean;

  @ApiProperty(seerGameOptionsApiProperties.canSeeRoles)
  @Prop({ default: seerGameOptionsFieldsSpecs.canSeeRoles.default })
  @Expose()
  public canSeeRoles: boolean;
}

const SeerGameOptionsSchema = SchemaFactory.createForClass(SeerGameOptions);

export { SeerGameOptions, SeerGameOptionsSchema };