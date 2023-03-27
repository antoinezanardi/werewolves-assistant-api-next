import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { wildChildGameOptionsApiProperties, wildChildGameOptionsFieldsSpecs } from "../../../../constants/game-options/roles-game-options/wild-child-game-options.constant";

class CreateWildChildGameOptionsDto {
  @ApiProperty({
    ...wildChildGameOptionsApiProperties.isTransformationRevealed,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isTransformationRevealed: boolean = wildChildGameOptionsFieldsSpecs.isTransformationRevealed.default;
}

export { CreateWildChildGameOptionsDto };