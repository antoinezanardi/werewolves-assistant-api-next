import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { ravenGameOptionsApiProperties, ravenGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/raven-game-options.constant";

class CreateRavenGameOptionsDto {
  @ApiProperty(ravenGameOptionsApiProperties.markPenalty)
  @IsOptional()
  @Min(ravenGameOptionsFieldsSpecs.markPenalty.minimum)
  @Max(ravenGameOptionsFieldsSpecs.markPenalty.maximum)
  public markPenalty?: number;
}

export { CreateRavenGameOptionsDto };