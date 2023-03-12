import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { bigBadWolfGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/big-bad-wolf-game-options.constant";

class CreateBigBadWolfGameOptionsDto {
  @ApiProperty(bigBadWolfGameOptionsApiProperties.isPowerlessIfWerewolfDies)
  @IsOptional()
  public isPowerlessIfWerewolfDies?: boolean;
}

export { CreateBigBadWolfGameOptionsDto };