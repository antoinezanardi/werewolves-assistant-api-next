import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { threeBrothersGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/three-brothers-game-options.constant";

class CreateThreeBrothersGameOptionsDto {
  @ApiProperty(threeBrothersGameOptionsApiProperties.wakingUpInterval)
  @IsOptional()
  @Min(0)
  @Max(5)
  public wakingUpInterval?: number;
}

export { CreateThreeBrothersGameOptionsDto };