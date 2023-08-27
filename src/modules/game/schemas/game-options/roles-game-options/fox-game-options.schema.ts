import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { foxGameOptionsApiProperties, foxGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/fox-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class FoxGameOptions {
  @ApiProperty(foxGameOptionsApiProperties.isPowerlessIfMissesWerewolf)
  @Prop({ default: foxGameOptionsFieldsSpecs.isPowerlessIfMissesWerewolf.default })
  @Expose()
  public isPowerlessIfMissesWerewolf: boolean;
}

const FoxGameOptionsSchema = SchemaFactory.createForClass(FoxGameOptions);

export { FoxGameOptions, FoxGameOptionsSchema };