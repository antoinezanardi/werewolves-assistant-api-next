import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";
import { ancientGameOptionsApiProperties, ancientGameOptionsFieldsSpecs } from "../../../../schemas/game-options/constants/roles-game-options/ancient-game-options.constant";

class CreateAncientGameOptionsDto {
  @ApiProperty({
    ...ancientGameOptionsApiProperties.livesCountAgainstWerewolves,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(ancientGameOptionsFieldsSpecs.livesCountAgainstWerewolves.minimum)
  @Max(ancientGameOptionsFieldsSpecs.livesCountAgainstWerewolves.maximum)
  public livesCountAgainstWerewolves: number = ancientGameOptionsFieldsSpecs.livesCountAgainstWerewolves.default;

  @ApiProperty({
    ...ancientGameOptionsApiProperties.doesTakeHisRevenge,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  public doesTakeHisRevenge: boolean = ancientGameOptionsFieldsSpecs.doesTakeHisRevenge.default;
}

export { CreateAncientGameOptionsDto };