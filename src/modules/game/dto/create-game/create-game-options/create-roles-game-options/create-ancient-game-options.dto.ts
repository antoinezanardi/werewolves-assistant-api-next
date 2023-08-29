import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

import { ANCIENT_GAME_OPTIONS_API_PROPERTIES, ANCIENT_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/ancient-game-options.constant";

class CreateAncientGameOptionsDto {
  @ApiProperty({
    ...ANCIENT_GAME_OPTIONS_API_PROPERTIES.livesCountAgainstWerewolves,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.minimum)
  @Max(ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.maximum)
  public livesCountAgainstWerewolves: number = ANCIENT_GAME_OPTIONS_FIELDS_SPECS.livesCountAgainstWerewolves.default;

  @ApiProperty({
    ...ANCIENT_GAME_OPTIONS_API_PROPERTIES.doesTakeHisRevenge,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public doesTakeHisRevenge: boolean = ANCIENT_GAME_OPTIONS_FIELDS_SPECS.doesTakeHisRevenge.default;
}

export { CreateAncientGameOptionsDto };