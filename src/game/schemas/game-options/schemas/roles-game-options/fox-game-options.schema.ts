import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { foxGameOptionsApiProperties } from "../../constants/roles-game-options/fox-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class FoxGameOptions {
  @ApiProperty(foxGameOptionsApiProperties.isPowerlessIfMissesWerewolf)
  @Prop({ default: foxGameOptionsApiProperties.isPowerlessIfMissesWerewolf.default as boolean })
  public isPowerlessIfMissesWerewolf: boolean;
}

const FoxGameOptionsSchema = SchemaFactory.createForClass(FoxGameOptions);

export { FoxGameOptions, FoxGameOptionsSchema };