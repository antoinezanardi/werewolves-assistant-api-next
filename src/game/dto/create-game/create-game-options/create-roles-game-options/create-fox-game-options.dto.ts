import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { foxGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/fox-game-options.constant";

class CreateFoxGameOptionsDto {
  @ApiProperty(foxGameOptionsApiProperties.isPowerlessIfMissesWerewolf)
  @IsOptional()
  public isPowerlessIfMissesWerewolf?: boolean;
}

export { CreateFoxGameOptionsDto };