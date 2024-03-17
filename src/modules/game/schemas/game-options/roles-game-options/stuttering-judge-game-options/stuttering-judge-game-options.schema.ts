import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

import { STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES, STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/stuttering-judge-game-options/stuttering-judge-game-options.schema.constants";

@Schema({
  versionKey: false,
  id: false,
  _id: false,
})
class StutteringJudgeGameOptions {
  @ApiProperty(STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES.voteRequestsCount as ApiPropertyOptions)
  @Prop(STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount)
  @Expose()
  public voteRequestsCount: number;
}

const STUTTERING_JUDGE_GAME_OPTIONS_SCHEMA = SchemaFactory.createForClass(StutteringJudgeGameOptions);

export {
  StutteringJudgeGameOptions,
  STUTTERING_JUDGE_GAME_OPTIONS_SCHEMA,
};