import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { RAVEN_GAME_OPTIONS_API_PROPERTIES, RAVEN_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/raven-game-options.constant";

class CreateRavenGameOptionsDto {
  @ApiProperty({
    ...RAVEN_GAME_OPTIONS_API_PROPERTIES.markPenalty,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(RAVEN_GAME_OPTIONS_FIELDS_SPECS.markPenalty.minimum)
  @Max(RAVEN_GAME_OPTIONS_FIELDS_SPECS.markPenalty.maximum)
  public markPenalty: number = RAVEN_GAME_OPTIONS_FIELDS_SPECS.markPenalty.default;
}

export { CreateRavenGameOptionsDto };