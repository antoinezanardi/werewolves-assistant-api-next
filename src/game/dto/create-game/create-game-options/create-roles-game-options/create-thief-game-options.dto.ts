import { IsOptional, Max, Min } from "class-validator";

class CreateThiefGameOptionsDto {
  @IsOptional()
  public mustChooseBetweenWerewolves?: boolean;

  @IsOptional()
  @Min(1)
  @Max(5)
  public additionalCardsCount?: number;
}

export { CreateThiefGameOptionsDto };