import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { dogWolfGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/dog-wolf-game-options.constant";
import { wildChildGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/wild-child-game-options.constant";

class CreateDogWolfGameOptionsDto {
  @ApiProperty({
    ...dogWolfGameOptionsApiProperties.isChosenSideRevealed,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isChosenSideRevealed: boolean = wildChildGameOptionsFieldsSpecs.isTransformationRevealed.default;
}

export { CreateDogWolfGameOptionsDto };