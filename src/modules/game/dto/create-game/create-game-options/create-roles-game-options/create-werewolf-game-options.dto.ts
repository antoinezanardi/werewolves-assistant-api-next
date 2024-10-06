import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { WEREWOLF_GAME_OPTIONS_API_PROPERTIES, WEREWOLF_GAME_OPTIONS_FIELDS_SPECS } from "@/modules/game/schemas/game-options/roles-game-options/werewolf-game-options/werewolf-game-options.schema.constants";

class CreateWerewolfGameOptionsDto {
  @ApiProperty({
    ...WEREWOLF_GAME_OPTIONS_API_PROPERTIES.canEatEachOther,
    required: false,
  } as ApiPropertyOptions)
  @IsOptional()
  @IsBoolean()
  public canEatEachOther: boolean = WEREWOLF_GAME_OPTIONS_FIELDS_SPECS.canEatEachOther.default;
}

export { CreateWerewolfGameOptionsDto };