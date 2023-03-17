import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { threeBrothersGameOptionsApiProperties, threeBrothersGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/three-brothers-game-options.constant";

class CreateThreeBrothersGameOptionsDto {
  @ApiProperty(threeBrothersGameOptionsApiProperties.wakingUpInterval)
  @IsOptional()
  @Min(threeBrothersGameOptionsFieldsSpecs.wakingUpInterval.minimum)
  @Max(threeBrothersGameOptionsFieldsSpecs.wakingUpInterval.maximum)
  public wakingUpInterval?: number;
}

export { CreateThreeBrothersGameOptionsDto };