import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { littleGirlGameOptionsApiProperties } from "../../constants/roles-game-options/little-girl-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class LittleGirlGameOptions {
  @ApiProperty(littleGirlGameOptionsApiProperties.isProtectedByGuard)
  @Prop({ default: littleGirlGameOptionsApiProperties.isProtectedByGuard.default as boolean })
  public isProtectedByGuard: boolean;
}

const LittleGirlGameOptionsSchema = SchemaFactory.createForClass(LittleGirlGameOptions);

export { LittleGirlGameOptions, LittleGirlGameOptionsSchema };