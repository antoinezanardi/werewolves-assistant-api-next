import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

import { ACTOR_GAME_OPTIONS_API_PROPERTIES, ACTOR_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/actor-game-options/actor-game-options.schema.constant";

class CreateActorGameOptionsDto {
  @ApiProperty({
    ...ACTOR_GAME_OPTIONS_API_PROPERTIES.isPowerlessOnWerewolvesSide,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isPowerlessOnWerewolvesSide: boolean = ACTOR_GAME_OPTIONS_FIELDS_SPECS.isPowerlessOnWerewolvesSide.default;

  @ApiProperty({
    ...ACTOR_GAME_OPTIONS_API_PROPERTIES.additionalCardsCount,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsInt()
  @Min(ACTOR_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.min)
  @Max(ACTOR_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.max)
  public additionalCardsCount: number = ACTOR_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.default;
}

export { CreateActorGameOptionsDto };