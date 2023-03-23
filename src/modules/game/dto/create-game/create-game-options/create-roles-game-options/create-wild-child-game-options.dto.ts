import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { wildChildGameOptionsApiProperties, wildChildGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/wild-child-game-options.constant";

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