import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { ACTOR_GAME_OPTIONS_API_PROPERTIES, ACTOR_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/actor-game-options/actor-game-options.schema.constants";

class CreateActorGameOptionsDto {
  @ApiProperty({
    ...ACTOR_GAME_OPTIONS_API_PROPERTIES.isPowerlessOnWerewolvesSide,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public isPowerlessOnWerewolvesSide: boolean = ACTOR_GAME_OPTIONS_FIELDS_SPECS.isPowerlessOnWerewolvesSide.default;
}

export { CreateActorGameOptionsDto };