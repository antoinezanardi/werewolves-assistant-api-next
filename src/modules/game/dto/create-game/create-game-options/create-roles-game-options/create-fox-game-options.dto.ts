import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { FOX_GAME_OPTIONS_API_PROPERTIES, FOX_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/constants/game-options/roles-game-options/fox-game-options.constant";

class CreateFoxGameOptionsDto {
  @ApiProperty({
    ...FOX_GAME_OPTIONS_API_PROPERTIES.isPowerlessIfMissesWerewolf,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isPowerlessIfMissesWerewolf: boolean = FOX_GAME_OPTIONS_FIELDS_SPECS.isPowerlessIfMissesWerewolf.default;
}

export { CreateFoxGameOptionsDto };