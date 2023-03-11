import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Max, Min } from "class-validator";
import { defaultGameOptions } from "../../../constants/game-options/game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class StutteringJudgeGameOptions {
  @ApiProperty({
    description: "Number of vote requests that the `stuttering judge` can make during the game",
    default: defaultGameOptions.roles.stutteringJudge.voteRequestsCount,
  })
  @Min(1)
  @Max(5)
  @Prop({ default: defaultGameOptions.roles.stutteringJudge.voteRequestsCount })
  public voteRequestsCount: number;
}

const StutteringJudgeGameOptionsSchema = SchemaFactory.createForClass(StutteringJudgeGameOptions);

export { StutteringJudgeGameOptions, StutteringJudgeGameOptionsSchema };