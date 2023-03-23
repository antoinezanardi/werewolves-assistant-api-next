import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { bearTamerGameOptionsApiProperties, bearTamerGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/bear-tamer-game-options.constant";

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