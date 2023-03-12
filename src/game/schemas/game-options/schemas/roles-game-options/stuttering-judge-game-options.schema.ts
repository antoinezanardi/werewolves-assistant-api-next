import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { stutteringJudgeGameOptionsApiProperties } from "../../constants/roles-game-options/stuttering-judge-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class StutteringJudgeGameOptions {
  @ApiProperty(stutteringJudgeGameOptionsApiProperties.voteRequestsCount)
  @Prop({
    default: stutteringJudgeGameOptionsApiProperties.voteRequestsCount.default as number,
    min: stutteringJudgeGameOptionsApiProperties.voteRequestsCount.minimum,
    max: stutteringJudgeGameOptionsApiProperties.voteRequestsCount.maximum,
  })
  public voteRequestsCount: number;
}

const StutteringJudgeGameOptionsSchema = SchemaFactory.createForClass(StutteringJudgeGameOptions);

export { StutteringJudgeGameOptions, StutteringJudgeGameOptionsSchema };