import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { whiteWerewolfGameOptionsApiProperties, whiteWerewolfGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/white-werewolf-game-options.constant";

class CreateWhiteWerewolfGameOptionsDto {
  @ApiProperty({
    ...whiteWerewolfGameOptionsApiProperties.wakingUpInterval,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(whiteWerewolfGameOptionsFieldsSpecs.wakingUpInterval.minimum)
  @Max(whiteWerewolfGameOptionsFieldsSpecs.wakingUpInterval.maximum)
  public wakingUpInterval: number = whiteWerewolfGameOptionsFieldsSpecs.wakingUpInterval.default;
}

export { CreateWhiteWerewolfGameOptionsDto };