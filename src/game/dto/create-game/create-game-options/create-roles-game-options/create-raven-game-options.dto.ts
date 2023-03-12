import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { ravenGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/raven-game-options.constant";

class CreateRavenGameOptionsDto {
  @ApiProperty(ravenGameOptionsApiProperties.markPenalty)
  @IsOptional()
  @Min(1)
  @Max(5)
  public markPenalty?: number;
}

export { CreateRavenGameOptionsDto };