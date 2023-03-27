import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { seerGameOptionsApiProperties, seerGameOptionsFieldsSpecs } from "../../../../constants/game-options/roles-game-options/seer-game-options.constant";

class CreateSeerGameOptionsDto {
  @ApiProperty({
    ...seerGameOptionsApiProperties.isTalkative,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isTalkative: boolean = seerGameOptionsFieldsSpecs.isTalkative.default;

  @ApiProperty({
    ...seerGameOptionsApiProperties.canSeeRoles,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public canSeeRoles: boolean = seerGameOptionsFieldsSpecs.canSeeRoles.default;
}

export { CreateSeerGameOptionsDto };