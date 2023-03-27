import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import { threeBrothersGameOptionsApiProperties, threeBrothersGameOptionsFieldsSpecs } from "../../../../constants/game-options/roles-game-options/three-brothers-game-options.constant";

class CreateThreeBrothersGameOptionsDto {
  @ApiProperty({
    ...threeBrothersGameOptionsApiProperties.wakingUpInterval,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(threeBrothersGameOptionsFieldsSpecs.wakingUpInterval.minimum)
  @Max(threeBrothersGameOptionsFieldsSpecs.wakingUpInterval.maximum)
  public wakingUpInterval: number = threeBrothersGameOptionsFieldsSpecs.wakingUpInterval.default;
}

export { CreateThreeBrothersGameOptionsDto };