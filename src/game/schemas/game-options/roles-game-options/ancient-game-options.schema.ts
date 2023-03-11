import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class AncientGameOptions {
  @ApiProperty({
    description: "Number of lives ancient has against `werewolves`",
    default: defaultGameOptions.roles.ancient.livesCountAgainstWerewolves,
  })
  @Prop({ default: defaultGameOptions.roles.ancient.livesCountAgainstWerewolves })
  public livesCountAgainstWerewolves: number;

  @ApiProperty({
    description: "If set to `true`, the ancient will make all players from the villagers side powerless if he dies from them",
    default: defaultGameOptions.roles.ancient.doesTakeHisRevenge,
  })
  @Prop({ default: defaultGameOptions.roles.ancient.doesTakeHisRevenge })
  public doesTakeHisRevenge: boolean;
}

const AncientGameOptionsSchema = SchemaFactory.createForClass(AncientGameOptions);

export { AncientGameOptions, AncientGameOptionsSchema };