import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { twoSistersGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/two-sisters-game-options.constant";

class CreateTwoSistersGameOptionsDto {
  @ApiProperty(twoSistersGameOptionsApiProperties.wakingUpInterval)
  @IsOptional()
  @Min(0)
  @Max(5)
  public wakingUpInterval?: number;
}

export { CreateTwoSistersGameOptionsDto };