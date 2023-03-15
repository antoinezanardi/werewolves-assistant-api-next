import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { thiefGameOptionsApiProperties, thiefGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/thief-judge-game-options.constant";

class CreateThiefGameOptionsDto {
  @ApiProperty(thiefGameOptionsApiProperties.mustChooseBetweenWerewolves)
  @IsOptional()
  public mustChooseBetweenWerewolves?: boolean;

  @ApiProperty(thiefGameOptionsApiProperties.additionalCardsCount)
  @IsOptional()
  @Min(thiefGameOptionsFieldsSpecs.additionalCardsCount.minimum)
  @Max(thiefGameOptionsFieldsSpecs.additionalCardsCount.maximum)
  public additionalCardsCount?: number;
}

export { CreateThiefGameOptionsDto };