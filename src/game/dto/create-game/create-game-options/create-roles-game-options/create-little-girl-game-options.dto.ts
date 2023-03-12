import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { littleGirlGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/little-girl-game-options.constant";

class CreateLittleGirlGameOptionsDto {
  @ApiProperty(littleGirlGameOptionsApiProperties.isProtectedByGuard)
  @IsOptional()
  public isProtectedByGuard?: boolean;
}

export { CreateLittleGirlGameOptionsDto };