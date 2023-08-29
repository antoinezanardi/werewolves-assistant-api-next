import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES, STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/stuttering-judge-game-options.constant";

class CreateStutteringJudgeGameOptionsDto {
  @ApiProperty({
    ...STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES.voteRequestsCount,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount.minimum)
  @Max(STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount.maximum)
  public voteRequestsCount: number = STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount.default;
}

export { CreateStutteringJudgeGameOptionsDto };