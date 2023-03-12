import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { whiteWerewolfGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/white-werewolf-game-options.constant";

class CreateWhiteWerewolfGameOptionsDto {
  @ApiProperty(whiteWerewolfGameOptionsApiProperties.wakingUpInterval)
  @IsOptional()
  @Min(1)
  @Max(5)
  public wakingUpInterval?: number;
}

export { CreateWhiteWerewolfGameOptionsDto };