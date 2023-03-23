import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import { twoSistersGameOptionsApiProperties, twoSistersGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/two-sisters-game-options.constant";

class CreateTwoSistersGameOptionsDto {
  @ApiProperty({
    ...twoSistersGameOptionsApiProperties.wakingUpInterval,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(twoSistersGameOptionsFieldsSpecs.wakingUpInterval.minimum)
  @Max(twoSistersGameOptionsFieldsSpecs.wakingUpInterval.maximum)
  public wakingUpInterval: number = twoSistersGameOptionsFieldsSpecs.wakingUpInterval.default;
}

export { CreateTwoSistersGameOptionsDto };