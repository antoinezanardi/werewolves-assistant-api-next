import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { thiefGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/thief-judge-game-options.constant";

class CreateThiefGameOptionsDto {
  @ApiProperty(thiefGameOptionsApiProperties.mustChooseBetweenWerewolves)
  @IsOptional()
  public mustChooseBetweenWerewolves?: boolean;

  @ApiProperty(thiefGameOptionsApiProperties.additionalCardsCount)
  @IsOptional()
  @Min(1)
  @Max(5)
  public additionalCardsCount?: number;
}

export { CreateThiefGameOptionsDto };