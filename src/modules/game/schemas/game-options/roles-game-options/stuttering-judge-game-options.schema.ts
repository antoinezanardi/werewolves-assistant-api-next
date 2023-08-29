import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES, STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/stuttering-judge-game-options.constant";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class StutteringJudgeGameOptions {
  @ApiProperty(STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES.voteRequestsCount)
  @Prop({
    default: STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount.default,
    min: STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount.minimum,
    max: STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount.maximum,
  })
  @Expose()
  public voteRequestsCount: number;
}

const STUTTERING_JUDGE_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(StutteringJudgeGameOptions);

export {
  StutteringJudgeGameOptions,
  STUTTERING_JUDGE_GAME_OPTIONS_SCHEMA,
};