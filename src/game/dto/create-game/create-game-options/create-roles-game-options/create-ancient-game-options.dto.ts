import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { ancientGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/ancient-game-options.constant";

class CreateAncientGameOptionsDto {
  @ApiProperty(ancientGameOptionsApiProperties.livesCountAgainstWerewolves)
  @IsOptional()
  @Min(1)
  @Max(5)
  public livesCountAgainstWerewolves?: number;

  @ApiProperty(ancientGameOptionsApiProperties.doesTakeHisRevenge)
  @IsOptional()
  public doesTakeHisRevenge?: boolean;
}

export { CreateAncientGameOptionsDto };