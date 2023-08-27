import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

import { votesGameOptionsApiProperties, votesGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/votes-game-options.constant";

class CreateVotesGameOptionsDto {
  @ApiProperty({
    ...votesGameOptionsApiProperties.canBeSkipped,
    required: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  public canBeSkipped: boolean = votesGameOptionsFieldsSpecs.canBeSkipped.default;
}

export { CreateVotesGameOptionsDto };