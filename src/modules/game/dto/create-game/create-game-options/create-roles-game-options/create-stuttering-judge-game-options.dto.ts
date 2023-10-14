import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES, STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/stuttering-judge-game-options/stuttering-judge-game-options.schema.constant";

class CreateStutteringJudgeGameOptionsDto {
  @ApiProperty({
    ...STUTTERING_JUDGE_GAME_OPTIONS_API_PROPERTIES.voteRequestsCount,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsInt()
  @Min(STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount.min)
  @Max(STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount.max)
  public voteRequestsCount: number = STUTTERING_JUDGE_GAME_OPTIONS_FIELDS_SPECS.voteRequestsCount.default;
}

export { CreateStutteringJudgeGameOptionsDto };