import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Max, Min } from "class-validator";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class RavenGameOptions {
  @ApiProperty({
    description: "Penalty of votes against the player targeted by the `raven mark` for the next village's vote. In other words, the `raven marked` player will have two votes against himself if this value is set to `2`",
    default: defaultGameOptions.roles.raven.markPenalty,
  })
  @Min(1)
  @Max(5)
  @Prop({
    default: defaultGameOptions.roles.raven.markPenalty,
    min: 1,
    max: 5,
  })
  public markPenalty: number;
}

const RavenGameOptionsSchema = SchemaFactory.createForClass(RavenGameOptions);

export { RavenGameOptions, RavenGameOptionsSchema };