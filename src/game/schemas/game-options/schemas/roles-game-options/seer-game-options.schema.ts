import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { seerGameOptionsApiProperties, seerGameOptionsFieldsSpecs } from "../../constants/roles-game-options/seer-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SeerGameOptions {
  @ApiProperty(seerGameOptionsApiProperties.isTalkative)
  @Prop({ default: seerGameOptionsFieldsSpecs.isTalkative.default })
  public isTalkative: boolean;

  @ApiProperty(seerGameOptionsApiProperties.canSeeRoles)
  @Prop({ default: seerGameOptionsFieldsSpecs.canSeeRoles.default })
  public canSeeRoles: boolean;
}

const SeerGameOptionsSchema = SchemaFactory.createForClass(SeerGameOptions);

export { SeerGameOptions, SeerGameOptionsSchema };