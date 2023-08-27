import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { foxGameOptionsApiProperties, foxGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/fox-game-options.constant";

class CreateFoxGameOptionsDto {
  @ApiProperty({
    ...foxGameOptionsApiProperties.isPowerlessIfMissesWerewolf,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isPowerlessIfMissesWerewolf: boolean = foxGameOptionsFieldsSpecs.isPowerlessIfMissesWerewolf.default;
}

export { CreateFoxGameOptionsDto };