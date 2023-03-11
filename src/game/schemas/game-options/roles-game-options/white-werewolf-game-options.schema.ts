import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Max, Min } from "class-validator";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class WhiteWerewolfGameOptions {
  @ApiProperty({
    description: "Since first `night`, interval of `nights` when the `white werewolf` is waking up. In other words, he wakes up every other night if value is `1`",
    default: defaultGameOptions.roles.whiteWerewolf.wakingUpInterval,
  })
  @Min(1)
  @Max(5)
  @Prop({
    default: defaultGameOptions.roles.whiteWerewolf.wakingUpInterval,
    min: 1,
    max: 5,
  })
  public wakingUpInterval: number;
}

const WhiteWerewolfGameOptionsSchema = SchemaFactory.createForClass(WhiteWerewolfGameOptions);

export { WhiteWerewolfGameOptions, WhiteWerewolfGameOptionsSchema };