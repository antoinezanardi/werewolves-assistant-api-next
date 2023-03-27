import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { foxGameOptionsApiProperties, foxGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/fox-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class FoxGameOptions {
  @ApiProperty(foxGameOptionsApiProperties.isPowerlessIfMissesWerewolf)
  @Prop({ default: foxGameOptionsFieldsSpecs.isPowerlessIfMissesWerewolf.default })
  public isPowerlessIfMissesWerewolf: boolean;
}

const FoxGameOptionsSchema = SchemaFactory.createForClass(FoxGameOptions);

export { FoxGameOptions, FoxGameOptionsSchema };