import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Max, Min } from "class-validator";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class TwoSistersGameOptions {
  @ApiProperty({
    description: "Since first `night`, interval of `nights` when the `two sisters` are waking up. In other words, they wake up every other night if value is `1`. If set to `0`, they are waking up the first night only",
    default: defaultGameOptions.roles.twoSisters.wakingUpInterval,
  })
  @Min(0)
  @Max(5)
  @Prop({
    default: defaultGameOptions.roles.twoSisters.wakingUpInterval,
    min: 0,
    max: 5,
  })
  public wakingUpInterval: number;
}

const TwoSistersGameOptionsSchema = SchemaFactory.createForClass(TwoSistersGameOptions);

export { TwoSistersGameOptions, TwoSistersGameOptionsSchema };