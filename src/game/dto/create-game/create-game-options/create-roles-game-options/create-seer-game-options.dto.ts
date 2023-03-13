import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { seerGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/seer-game-options.constant";

class CreateSeerGameOptionsDto {
  @ApiProperty(seerGameOptionsApiProperties.isTalkative)
  @IsOptional()
  public isTalkative?: boolean;

  @ApiProperty(seerGameOptionsApiProperties.canSeeRoles)
  @IsOptional()
  public canSeeRoles?: boolean;
}

export { CreateSeerGameOptionsDto };