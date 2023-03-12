import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { seerGameOptionsApiProperties } from "../../constants/roles-game-options/seer-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class SeerGameOptions {
  @ApiProperty(seerGameOptionsApiProperties.isTalkative)
  @Prop({ default: seerGameOptionsApiProperties.isTalkative.default as boolean })
  public isTalkative: boolean;

  @ApiProperty(seerGameOptionsApiProperties.canSeeRoles)
  @Prop({ default: seerGameOptionsApiProperties.canSeeRoles.default as boolean })
  public canSeeRoles: boolean;
}

const SeerGameOptionsSchema = SchemaFactory.createForClass(SeerGameOptions);

export { SeerGameOptions, SeerGameOptionsSchema };