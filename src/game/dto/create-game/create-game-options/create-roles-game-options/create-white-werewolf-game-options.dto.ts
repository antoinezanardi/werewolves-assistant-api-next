import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { whiteWerewolfGameOptionsApiProperties, whiteWerewolfGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/white-werewolf-game-options.constant";

class CreateWhiteWerewolfGameOptionsDto {
  @ApiProperty(whiteWerewolfGameOptionsApiProperties.wakingUpInterval)
  @IsOptional()
  @Min(whiteWerewolfGameOptionsFieldsSpecs.wakingUpInterval.minimum)
  @Max(whiteWerewolfGameOptionsFieldsSpecs.wakingUpInterval.maximum)
  public wakingUpInterval?: number;
}

export { CreateWhiteWerewolfGameOptionsDto };