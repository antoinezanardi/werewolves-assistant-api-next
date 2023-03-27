import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { stutteringJudgeGameOptionsApiProperties, stutteringJudgeGameOptionsFieldsSpecs } from "../../../constants/game-options/roles-game-options/stuttering-judge-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class StutteringJudgeGameOptions {
  @ApiProperty(stutteringJudgeGameOptionsApiProperties.voteRequestsCount)
  @Prop({
    default: stutteringJudgeGameOptionsFieldsSpecs.voteRequestsCount.default,
    min: stutteringJudgeGameOptionsFieldsSpecs.voteRequestsCount.minimum,
    max: stutteringJudgeGameOptionsFieldsSpecs.voteRequestsCount.maximum,
  })
  public voteRequestsCount: number;
}

const StutteringJudgeGameOptionsSchema = SchemaFactory.createForClass(StutteringJudgeGameOptions);

export { StutteringJudgeGameOptions, StutteringJudgeGameOptionsSchema };