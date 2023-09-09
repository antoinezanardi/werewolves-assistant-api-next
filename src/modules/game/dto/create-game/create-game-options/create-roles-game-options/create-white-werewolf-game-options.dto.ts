import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { WHITE_WEREWOLF_GAME_OPTIONS_API_PROPERTIES, WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/white-werewolf-game-options/white-werewolf-game-options.schema.constant";

class CreateWhiteWerewolfGameOptionsDto {
  @ApiProperty({
    ...WHITE_WEREWOLF_GAME_OPTIONS_API_PROPERTIES.wakingUpInterval,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.minimum)
  @Max(WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.maximum)
  public wakingUpInterval: number = WHITE_WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.wakingUpInterval.default;
}

export { CreateWhiteWerewolfGameOptionsDto };