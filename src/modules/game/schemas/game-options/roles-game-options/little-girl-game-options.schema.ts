import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { littleGirlGameOptionsApiProperties, littleGirlGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/little-girl-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class LittleGirlGameOptions {
  @ApiProperty(littleGirlGameOptionsApiProperties.isProtectedByGuard)
  @Prop({ default: littleGirlGameOptionsFieldsSpecs.isProtectedByGuard.default })
  public isProtectedByGuard: boolean;
}

const LittleGirlGameOptionsSchema = SchemaFactory.createForClass(LittleGirlGameOptions);

export { LittleGirlGameOptions, LittleGirlGameOptionsSchema };