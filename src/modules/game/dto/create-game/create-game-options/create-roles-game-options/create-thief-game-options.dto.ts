import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";
import { thiefGameOptionsApiProperties, thiefGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/thief-judge-game-options.constant";

class CreateThiefGameOptionsDto {
  @ApiProperty({
    ...thiefGameOptionsApiProperties.mustChooseBetweenWerewolves,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public mustChooseBetweenWerewolves: boolean = thiefGameOptionsFieldsSpecs.mustChooseBetweenWerewolves.default;

  @ApiProperty({
    ...thiefGameOptionsApiProperties.additionalCardsCount,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(thiefGameOptionsFieldsSpecs.additionalCardsCount.minimum)
  @Max(thiefGameOptionsFieldsSpecs.additionalCardsCount.maximum)
  public additionalCardsCount: number = thiefGameOptionsFieldsSpecs.additionalCardsCount.default;
}

export { CreateThiefGameOptionsDto };