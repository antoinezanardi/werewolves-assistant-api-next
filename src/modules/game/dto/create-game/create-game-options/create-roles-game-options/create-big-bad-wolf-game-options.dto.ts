import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { bigBadWolfGameOptionsApiProperties, bigBadWolfGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/big-bad-wolf-game-options.constant";

class CreateBigBadWolfGameOptionsDto {
  @ApiProperty({
    ...bigBadWolfGameOptionsApiProperties.isPowerlessIfWerewolfDies,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isPowerlessIfWerewolfDies: boolean = bigBadWolfGameOptionsFieldsSpecs.isPowerlessIfWerewolfDies.default;
}

export { CreateBigBadWolfGameOptionsDto };