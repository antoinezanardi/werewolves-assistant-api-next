import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class LittleGirlGameOptions {
  @ApiProperty({
    description: "If set to `false`, the `little girl` won't be protected by the `guard` from the `werewolves` attacks",
    default: defaultGameOptions.roles.littleGirl.isProtectedByGuard,
  })
  @Prop({ default: defaultGameOptions.roles.littleGirl.isProtectedByGuard })
  public isProtectedByGuard: boolean;
}

const LittleGirlGameOptionsSchema = SchemaFactory.createForClass(LittleGirlGameOptions);

export { LittleGirlGameOptions, LittleGirlGameOptionsSchema };