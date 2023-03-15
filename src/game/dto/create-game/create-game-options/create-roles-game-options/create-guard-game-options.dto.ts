import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { guardGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/guard-game-options.constant";

class CreateGuardGameOptionsDto {
  @ApiProperty(guardGameOptionsApiProperties.canProtectTwice)
  @IsOptional()
  public canProtectTwice?: boolean;
}

export { CreateGuardGameOptionsDto };