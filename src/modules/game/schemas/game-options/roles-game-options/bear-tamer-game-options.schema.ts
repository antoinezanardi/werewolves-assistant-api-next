import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { bearTamerGameOptionsApiProperties, bearTamerGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/bear-tamer-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class BearTamerGameOptions {
  @ApiProperty(bearTamerGameOptionsApiProperties.doesGrowlIfInfected)
  @Prop({ default: bearTamerGameOptionsFieldsSpecs.doesGrowlIfInfected.default })
  public doesGrowlIfInfected: boolean;
}

const BearTamerGameOptionsSchema = SchemaFactory.createForClass(BearTamerGameOptions);

export { BearTamerGameOptions, BearTamerGameOptionsSchema };