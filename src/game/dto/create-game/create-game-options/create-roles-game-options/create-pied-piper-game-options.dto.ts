import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, Min } from "class-validator";
import { piedPiperGameOptionsApiProperties } from "../../../../schemas/game-options/constants/roles-game-options/pied-piper-game-options.constant";

class CreatePiedPiperGameOptionsDto {
  @ApiProperty(piedPiperGameOptionsApiProperties.charmedPeopleCountPerNight)
  @IsOptional()
  @Min(1)
  @Max(5)
  public charmedPeopleCountPerNight?: number;

  @ApiProperty(piedPiperGameOptionsApiProperties.isPowerlessIfInfected)
  @IsOptional()
  public isPowerlessIfInfected?: boolean;
}

export { CreatePiedPiperGameOptionsDto };