import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { bearTamerGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/bear-tamer-game-options.constant";

class CreateBearTamerGameOptionsDto {
  @ApiProperty(bearTamerGameOptionsApiProperties.doesGrowlIfInfected)
  @IsOptional()
  public doesGrowlIfInfected?: boolean;
}

export { CreateBearTamerGameOptionsDto };