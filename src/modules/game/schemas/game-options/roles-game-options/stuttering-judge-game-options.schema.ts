import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { stutteringJudgeGameOptionsApiProperties, stutteringJudgeGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/stuttering-judge-game-options.constant";

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
  @Expose()
  public voteRequestsCount: number;
}

const StutteringJudgeGameOptionsSchema = SchemaFactory.createForClass(StutteringJudgeGameOptions);

export { StutteringJudgeGameOptions, StutteringJudgeGameOptionsSchema };