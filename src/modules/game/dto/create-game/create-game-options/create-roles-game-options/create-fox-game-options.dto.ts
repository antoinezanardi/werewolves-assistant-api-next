import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { foxGameOptionsApiProperties, foxGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/fox-game-options.constant";

class CreateFoxGameOptionsDto {
  @ApiProperty({
    ...foxGameOptionsApiProperties.isPowerlessIfMissesWerewolf,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isPowerlessIfMissesWerewolf: boolean = foxGameOptionsFieldsSpecs.isPowerlessIfMissesWerewolf.default;
}

export { CreateFoxGameOptionsDto };