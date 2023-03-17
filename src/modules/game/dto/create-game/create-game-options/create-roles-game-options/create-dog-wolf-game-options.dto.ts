import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { dogWolfGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/dog-wolf-game-options.constant";

class CreateDogWolfGameOptionsDto {
  @ApiProperty(dogWolfGameOptionsApiProperties.isChosenSideRevealed)
  @IsOptional()
  public isChosenSideRevealed?: boolean;
}

export { CreateDogWolfGameOptionsDto };