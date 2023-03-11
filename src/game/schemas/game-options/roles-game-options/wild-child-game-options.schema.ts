import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class WildChildGameOptions {
  @ApiProperty({
    description: "If set to `true`, when `wild child` joins the `werewolves` side because his model died, the `game master` will announce his transformation to other players",
    default: defaultGameOptions.roles.wildChild.isTransformationRevealed,
  })
  @Prop({ default: defaultGameOptions.roles.wildChild.isTransformationRevealed })
  public isTransformationRevealed: boolean;
}

const WildChildGameOptionsSchema = SchemaFactory.createForClass(WildChildGameOptions);

export { WildChildGameOptions, WildChildGameOptionsSchema };