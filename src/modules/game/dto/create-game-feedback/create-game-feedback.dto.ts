import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

import { GAME_FEEDBACK_FIELDS_SPECS } from "@/modules/game/schemas/game-feedback/game-feedback.schema.constants";

class CreateGameFeedbackDto {
  @IsInt()
  @Min(GAME_FEEDBACK_FIELDS_SPECS.score.min)
  @Max(GAME_FEEDBACK_FIELDS_SPECS.score.max)
  public score: number;

  @IsString()
  @MaxLength(GAME_FEEDBACK_FIELDS_SPECS.review.maxLength)
  @IsOptional()
  public review?: string;

  @IsBoolean()
  public hasEncounteredError: boolean;
}

export { CreateGameFeedbackDto };