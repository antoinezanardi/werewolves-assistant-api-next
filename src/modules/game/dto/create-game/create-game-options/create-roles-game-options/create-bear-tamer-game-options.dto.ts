import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

import { bearTamerGameOptionsApiProperties, bearTamerGameOptionsFieldsSpecs } from "@/modules/game/constants/game-options/roles-game-options/bear-tamer-game-options.constant";

class CreateBearTamerGameOptionsDto {
  @ApiProperty({
    ...bearTamerGameOptionsApiProperties.doesGrowlIfInfected,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public doesGrowlIfInfected: boolean = bearTamerGameOptionsFieldsSpecs.doesGrowlIfInfected.default;
}

export { CreateBearTamerGameOptionsDto };