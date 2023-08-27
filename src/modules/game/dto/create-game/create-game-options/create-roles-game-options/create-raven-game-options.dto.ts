import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

import { ravenGameOptionsApiProperties, ravenGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/raven-game-options.constant";

class CreateRavenGameOptionsDto {
  @ApiProperty({
    ...ravenGameOptionsApiProperties.markPenalty,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(ravenGameOptionsFieldsSpecs.markPenalty.minimum)
  @Max(ravenGameOptionsFieldsSpecs.markPenalty.maximum)
  public markPenalty: number = ravenGameOptionsFieldsSpecs.markPenalty.default;
}

export { CreateRavenGameOptionsDto };