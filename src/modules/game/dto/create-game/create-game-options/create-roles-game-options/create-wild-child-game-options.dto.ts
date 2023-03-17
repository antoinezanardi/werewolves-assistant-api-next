import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { wildChildGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/wild-child-game-options.constant";

class CreateWildChildGameOptionsDto {
  @ApiProperty(wildChildGameOptionsApiProperties.isTransformationRevealed)
  @IsOptional()
  public isTransformationRevealed?: boolean;
}

export { CreateWildChildGameOptionsDto };