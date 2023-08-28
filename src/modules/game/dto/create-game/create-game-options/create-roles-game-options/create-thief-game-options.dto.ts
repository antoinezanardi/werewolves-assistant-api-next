import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

import { THIEF_GAME_OPTIONS_API_PROPERTIES, THIEF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/thief-judge-game-options.constant";

class CreateThiefGameOptionsDto {
  @ApiProperty({
    ...THIEF_GAME_OPTIONS_API_PROPERTIES.mustChooseBetweenWerewolves,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public mustChooseBetweenWerewolves: boolean = THIEF_GAME_OPTIONS_FIELDS_SPECS.mustChooseBetweenWerewolves.default;

  @ApiProperty({
    ...THIEF_GAME_OPTIONS_API_PROPERTIES.additionalCardsCount,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(THIEF_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.minimum)
  @Max(THIEF_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.maximum)
  public additionalCardsCount: number = THIEF_GAME_OPTIONS_FIELDS_SPECS.additionalCardsCount.default;
}

export { CreateThiefGameOptionsDto };