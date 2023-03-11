import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Max, Min } from "class-validator";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class ThiefGameOptions {
  @ApiProperty({
    description: "If set to `true`, if all `thief` additional cards are from the `werewolves` side, he can't skip and must choose one",
    default: defaultGameOptions.roles.thief.mustChooseBetweenWerewolves,
  })
  @Prop({ default: defaultGameOptions.roles.thief.mustChooseBetweenWerewolves })
  public mustChooseBetweenWerewolves: boolean;

  @ApiProperty({
    description: "Number of additional cards for the `thief` at the beginning of the game",
    default: defaultGameOptions.roles.thief.additionalCardsCount,
  })
  @Min(1)
  @Max(5)
  @Prop({
    default: defaultGameOptions.roles.thief.additionalCardsCount,
    min: 1,
    max: 5,
  })
  public additionalCardsCount: number;
}

const ThiefGameOptionsSchema = SchemaFactory.createForClass(ThiefGameOptions);

export { ThiefGameOptions, ThiefGameOptionsSchema };