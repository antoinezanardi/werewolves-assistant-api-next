import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";
import { piedPiperGameOptionsApiProperties, piedPiperGameOptionsFieldsSpecs } from "../../../../constants/game-options/roles-game-options/pied-piper-game-options.constant";

class CreatePiedPiperGameOptionsDto {
  @ApiProperty({
    ...piedPiperGameOptionsApiProperties.charmedPeopleCountPerNight,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(piedPiperGameOptionsFieldsSpecs.charmedPeopleCountPerNight.minimum)
  @Max(piedPiperGameOptionsFieldsSpecs.charmedPeopleCountPerNight.maximum)
  public charmedPeopleCountPerNight: number = piedPiperGameOptionsFieldsSpecs.charmedPeopleCountPerNight.default;

  @ApiProperty({
    ...piedPiperGameOptionsApiProperties.isPowerlessIfInfected,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public isPowerlessIfInfected: boolean = piedPiperGameOptionsFieldsSpecs.isPowerlessIfInfected.default;
}

export { CreatePiedPiperGameOptionsDto };